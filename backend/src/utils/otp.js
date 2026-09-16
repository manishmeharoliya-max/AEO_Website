const { randomInt } = require('node:crypto')
const OTP_TTL_MS = 5 * 60 * 1000
const OTP_COOLDOWN_MS = 45 * 1000
const MAX_OTP_ATTEMPTS = 5

function generateOtpCode() {
  return String(randomInt(100000, 1000000))
}

function buildOtpPayload(code, now = Date.now()) {
  return {
    code,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
  }
}

function isOtpExpired(payload, now = Date.now()) {
  return !payload || !payload.expiresAt || now >= payload.expiresAt
}

function canRequestOtp(lastRequestedAt, now = Date.now()) {
  if (!lastRequestedAt) {
    return true
  }

  return now - lastRequestedAt >= OTP_COOLDOWN_MS
}

function isValidOtpFormat(otp) {
  return /^\d{6}$/.test(String(otp || '').trim())
}

module.exports = {
  OTP_TTL_MS,
  OTP_COOLDOWN_MS,
  MAX_OTP_ATTEMPTS,
  generateOtpCode,
  buildOtpPayload,
  isOtpExpired,
  canRequestOtp,
  isValidOtpFormat,
}
