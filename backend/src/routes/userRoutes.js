const asyncHandler = require('../utils/asyncHandler')
const express = require('express')
const { getUsers, updateUserHandler, deleteUserHandler } = require('../controllers/userController')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware(['admin', 'superadmin']), asyncHandler(getUsers))
router.put('/:id', authMiddleware(['admin', 'superadmin']), asyncHandler(updateUserHandler))
router.delete('/:id', authMiddleware(['superadmin']), asyncHandler(deleteUserHandler))

module.exports = router
