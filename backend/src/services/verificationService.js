const { createHmac, timingSafeEqual } = require('node:crypto');
const config = require('../config/env');
const { getPool } = require('../db/postgres');
const { generateOtpCode, OTP_TTL_MS, OTP_COOLDOWN_MS, MAX_OTP_ATTEMPTS } = require('../utils/otp');

const localChallenges = new Map();

function digest(key, code) {
  return createHmac('sha256', config.jwtSecret).update(`${key}:${code}`).digest('hex');
}

function failure(message, status = 401) {
  return Object.assign(new Error(message), { status });
}

async function issueCode(email, purpose) {
  const key = `${purpose}:${email}`;
  const code = generateOtpCode();
  const hash = digest(key, code);
  const now = Date.now();
  if (config.databaseUrl) {
    await getPool().query('DELETE FROM verification_challenges WHERE expires_at < NOW()');
    const result = await getPool().query(`
      INSERT INTO verification_challenges (challenge_key, code_hash, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (challenge_key) DO UPDATE SET
        code_hash = EXCLUDED.code_hash, attempts = 0,
        created_at = NOW(), expires_at = EXCLUDED.expires_at
      WHERE verification_challenges.created_at < $4
      RETURNING challenge_key`,
    [key, hash, new Date(now + OTP_TTL_MS), new Date(now - OTP_COOLDOWN_MS)]);
    if (!result.rowCount) throw failure('Please wait before requesting another code.', 429);
  } else {
    for (const [entryKey, entry] of localChallenges) {
      if (entry.expiresAt <= now) localChallenges.delete(entryKey);
    }
    const current = localChallenges.get(key);
    if (current && now - current.createdAt < OTP_COOLDOWN_MS) {
      throw failure('Please wait before requesting another code.', 429);
    }
    if (localChallenges.size >= 10000) throw failure('Please try again later.', 429);
    localChallenges.set(key, { hash, attempts: 0, createdAt: now, expiresAt: now + OTP_TTL_MS });
  }
  return code;
}

async function revokeCode(email, purpose, code) {
  const key = `${purpose}:${email}`;
  const hash = digest(key, code);
  if (config.databaseUrl) {
    await getPool().query('DELETE FROM verification_challenges WHERE challenge_key = $1 AND code_hash = $2', [key, hash]);
  } else if (localChallenges.get(key)?.hash === hash) {
    localChallenges.delete(key);
  }
}

async function verifyCode(email, purpose, code, consume = true) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    throw failure('Enter a valid 6-digit verification code.', 400);
  }
  const key = `${purpose}:${email}`;
  const hash = digest(key, code);

  if (config.databaseUrl) {
    const client = await getPool().connect();
    let error;
    try {
      await client.query('BEGIN');
      const result = await client.query('SELECT * FROM verification_challenges WHERE challenge_key = $1 FOR UPDATE', [key]);
      const record = result.rows[0];
      if (!record || new Date(record.expires_at).getTime() <= Date.now() || record.attempts >= MAX_OTP_ATTEMPTS) {
        error = failure('Code expired or attempts exceeded. Request a new code.');
      } else if (!timingSafeEqual(Buffer.from(record.code_hash), Buffer.from(hash))) {
        await client.query('UPDATE verification_challenges SET attempts = attempts + 1 WHERE challenge_key = $1', [key]);
        error = failure('Invalid verification code.');
      } else if (consume) {
        await client.query('DELETE FROM verification_challenges WHERE challenge_key = $1', [key]);
      }
      await client.query('COMMIT');
    } catch (databaseError) {
      await client.query('ROLLBACK');
      throw databaseError;
    } finally {
      client.release();
    }
    if (error) throw error;
    return;
  }

  const record = localChallenges.get(key);
  if (!record || record.expiresAt <= Date.now() || record.attempts >= MAX_OTP_ATTEMPTS) {
    throw failure('Code expired or attempts exceeded. Request a new code.');
  }
  if (!timingSafeEqual(Buffer.from(record.hash), Buffer.from(hash))) {
    record.attempts += 1;
    throw failure('Invalid verification code.');
  }
  if (consume) localChallenges.delete(key);
}

module.exports = { issueCode, revokeCode, verifyCode };
