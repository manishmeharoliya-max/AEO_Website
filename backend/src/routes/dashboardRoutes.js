const asyncHandler = require('../utils/asyncHandler')
const express = require('express')
const { getUserDashboard, getAdminDashboard, getSuperAdminDashboard } = require('../controllers/dashboardController')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/user', authMiddleware(['user']), asyncHandler(getUserDashboard))
router.get('/admin', authMiddleware(['admin', 'superadmin']), asyncHandler(getAdminDashboard))
router.get('/superadmin', authMiddleware(['superadmin']), asyncHandler(getSuperAdminDashboard))

module.exports = router
