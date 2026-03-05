const express = require('express');
const router = express.Router();
const { getRecentActivity } = require('../controllers/auditController');
const { protect, teacher } = require('../middleware/authMiddleware');

// GET /api/audit/recent
router.get('/recent', protect, teacher, getRecentActivity);

module.exports = router;
