const { createHash } = require('node:crypto');
const config = require('../config/env');
const { getPool } = require('../db/postgres');

function rateLimit({ limit = 30, windowMs = 15 * 60 * 1000, namespace = 'auth' } = {}) {
  const localBuckets = new Map();
  return async (req, res, next) => {
    const key = createHash('sha256').update(`${req.ip}:${namespace}`).digest('hex');
    const now = Date.now();
    let count;
    try {
      if (config.databaseUrl) {
        await getPool().query('DELETE FROM auth_rate_limits WHERE expires_at <= NOW()');
        const result = await getPool().query(`
          INSERT INTO auth_rate_limits (bucket_key, expires_at) VALUES ($1, $2)
          ON CONFLICT (bucket_key) DO UPDATE SET attempts = auth_rate_limits.attempts + 1
          RETURNING attempts`, [key, new Date(now + windowMs)]);
        count = result.rows[0].attempts;
      } else {
        for (const [bucketKey, bucket] of localBuckets) {
          if (bucket.expiresAt <= now) localBuckets.delete(bucketKey);
        }
        if (!localBuckets.has(key) && localBuckets.size >= 10000) {
          return res.status(429).json({ message: 'Please try again later.' });
        }
        const bucket = localBuckets.get(key) || { count: 0, expiresAt: now + windowMs };
        bucket.count += 1;
        localBuckets.set(key, bucket);
        count = bucket.count;
      }
      if (count > limit) {
        res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
        return res.status(429).json({ message: 'Too many attempts. Please try again later.' });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { rateLimit };
