const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authMiddleware } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const { submitInquiry, getInquiries } = require('../controllers/inquiryController');

const router = express.Router();
router.post('/', rateLimit({ limit: 8, namespace: 'inquiries' }), asyncHandler(submitInquiry));
router.get('/', authMiddleware(['admin', 'superadmin']), asyncHandler(getInquiries));
module.exports = router;
