const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';
const config = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'local-development-only-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL === 'true',
  databaseCa: process.env.DATABASE_CA?.replace(/\\n/g, '\n'),
  isProduction,
  seedDemoUsers: !isProduction && process.env.SEED_DEMO_USERS === 'true',
  allowDemoOtp: !isProduction && process.env.ALLOW_DEMO_OTP === 'true',
  trustProxy: Number(process.env.TRUST_PROXY_HOPS || 0),
};

function validateEnvironment() {
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error('PORT must be between 1 and 65535.');
  }
  if (!Number.isInteger(config.trustProxy) || config.trustProxy < 0) {
    throw new Error('TRUST_PROXY_HOPS must be a nonnegative integer.');
  }
  if (isProduction) {
    if (!config.databaseUrl) throw new Error('DATABASE_URL is required in production.');
    if (!process.env.JWT_SECRET || config.jwtSecret.length < 32 || /dev-secret|change-me|replace-with/i.test(config.jwtSecret)) {
      throw new Error('Production requires a strong JWT_SECRET of at least 32 characters.');
    }
    if (!config.clientUrl.startsWith('https://')) throw new Error('CLIENT_URL must use HTTPS in production.');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || /your-email|your-app/.test(process.env.EMAIL_USER + process.env.EMAIL_PASS)) {
      throw new Error('Configure EMAIL_USER and EMAIL_PASS for production verification emails.');
    }
  }
}

module.exports = { ...config, validateEnvironment };
