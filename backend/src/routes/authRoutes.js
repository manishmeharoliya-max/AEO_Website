const asyncHandler = require('../utils/asyncHandler')
const express = require('express')
const {
  login,
  requestOtp,
  verifyOtp,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  me,
} = require('../controllers/authController')
const { authMiddleware } = require('../middleware/auth')
const { rateLimit } = require('../middleware/rateLimit')

const router = express.Router()
const limitAuthentication = rateLimit()
router.use((req, res, next) => req.method === 'POST' ? limitAuthentication(req, res, next) : next())

router.post('/signup/request-otp', asyncHandler(requestOtp))
router.post('/signup/verify', asyncHandler(verifyOtp))
router.post('/login', asyncHandler(login))
router.post('/forgot-password/request-otp', asyncHandler(requestPasswordResetOtp))
router.post('/forgot-password/verify-otp', asyncHandler(verifyPasswordResetOtp))
router.post('/forgot-password/reset', asyncHandler(resetPassword))
router.get('/me', authMiddleware(), asyncHandler(me))

module.exports = router
