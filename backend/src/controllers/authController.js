const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { getUserByEmail, getUserById, createUser, sanitizeUser, updateUser } = require('../models/userModel');
const { issueCode, revokeCode, verifyCode } = require('../services/verificationService');
const { sendOtpEmail } = require('../services/emailService');

function normalizeEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  }
  return value.trim().toLowerCase();
}

function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 8 || Buffer.byteLength(value, 'utf8') > 72) {
    throw Object.assign(new Error('Use a password of at least 8 characters and no more than 72 UTF-8 bytes.'), { status: 400 });
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, version: Number(user.token_version || 0) },
    config.jwtSecret,
    { expiresIn: '8h', algorithm: 'HS256' },
  );
}

async function login(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  if (typeof password !== 'string' || !password || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: 'Enter your email and password.' });
  }
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  return res.json({ token: generateToken(user), user: sanitizeUser(user) });
}

async function deliverCode(email, purpose, res) {
  const code = await issueCode(email, purpose);
  const sent = await sendOtpEmail(email, code, purpose);
  if (!sent && !config.allowDemoOtp) {
    await revokeCode(email, purpose, code);
    return res.status(503).json({ message: 'Verification email could not be delivered. Please try again later.' });
  }
  return res.json({
    message: 'If the account is eligible, a verification code has been sent.',
    emailSent: sent,
    expiresInMinutes: 5,
    ...(!sent && config.allowDemoOtp ? { demoOtp: code } : {}),
  });
}

async function requestOtp(req, res) {
  const { name, role, purpose = 'signup' } = req.body || {};
  if (role && role !== 'user') return res.status(403).json({ message: 'Public signup is available only for user accounts.' });
  if (purpose !== 'signup') return res.status(400).json({ message: 'Invalid verification purpose.' });
  if (typeof name !== 'string' || !name.trim() || name.length > 255) {
    return res.status(400).json({ message: 'Enter your name (up to 255 characters).' });
  }
  const email = normalizeEmail(req.body.email);
  if (await getUserByEmail(email)) return res.status(409).json({ message: 'An account already exists with this email.' });
  return deliverCode(email, 'signup', res);
}

async function verifyOtp(req, res) {
  const { name, password, otp, role, purpose = 'signup' } = req.body || {};
  if (role && role !== 'user') return res.status(403).json({ message: 'Public signup is available only for user accounts.' });
  if (purpose !== 'signup') return res.status(400).json({ message: 'Invalid verification purpose.' });
  if (typeof name !== 'string' || !name.trim() || name.length > 255) {
    return res.status(400).json({ message: 'Enter your name (up to 255 characters).' });
  }
  const email = normalizeEmail(req.body.email);
  validatePassword(password);
  if (await getUserByEmail(email)) return res.status(409).json({ message: 'An account already exists with this email.' });
  await verifyCode(email, 'signup', otp);
  const user = await createUser({ name, email, password, role: 'user' });
  return res.status(201).json({ token: generateToken(user), user });
}

async function requestPasswordResetOtp(req, res) {
  const email = normalizeEmail(req.body?.email);
  if (!(await getUserByEmail(email))) {
    return res.json({ message: 'If the account is eligible, a verification code has been sent.', emailSent: true, expiresInMinutes: 5 });
  }
  return deliverCode(email, 'password_reset', res);
}

async function verifyPasswordResetOtp(req, res) {
  const email = normalizeEmail(req.body?.email);
  await verifyCode(email, 'password_reset', req.body?.otp, false);
  return res.json({ verified: true, message: 'Code verified. Set your new password.' });
}

async function resetPassword(req, res) {
  const email = normalizeEmail(req.body?.email);
  validatePassword(req.body?.password);
  await verifyCode(email, 'password_reset', req.body?.otp);
  const user = await getUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Unable to reset this account.' });
  await updateUser(user.id, { password: req.body.password });
  return res.json({ message: 'Password updated. Sign in again on your devices.' });
}

async function me(req, res) {
  return res.json(sanitizeUser(await getUserById(req.user.id)));
}

module.exports = { login, requestOtp, verifyOtp, requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword, me, generateToken };
