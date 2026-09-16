const asyncHandler = require('../utils/asyncHandler')
const express = require('express')
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

router.post('/create-intent', authMiddleware(['user']), asyncHandler(createPaymentIntent))
router.post('/confirm', authMiddleware(['user', 'admin', 'superadmin']), asyncHandler(confirmPayment))

module.exports = router
