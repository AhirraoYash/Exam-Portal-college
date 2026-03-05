const express = require('express');
const router = express.Router();
const { getTeachersWithTests } = require('../controllers/teacherController');
const { protect, teacher } = require('../middleware/authMiddleware');

// GET /api/teachers/teachers-with-tests
router.get('/teachers-with-tests', protect, teacher, getTeachersWithTests);

module.exports = router;
