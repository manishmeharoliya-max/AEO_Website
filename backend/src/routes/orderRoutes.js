const asyncHandler = require('../utils/asyncHandler')
const express = require('express')
const { createOrderHandler, listOrders } = require('../controllers/orderController')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

router.post('/', authMiddleware(['user', 'admin', 'superadmin']), asyncHandler(createOrderHandler))
router.get('/', authMiddleware(['admin', 'superadmin']), asyncHandler(listOrders))

module.exports = router
