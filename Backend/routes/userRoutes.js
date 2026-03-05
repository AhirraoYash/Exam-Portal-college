const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getStudents, updateStudentStatus, loginTeacher, deleteStudent, addTeacher, uploadProfilePhoto } = require('../controllers/userController.js');
const { protect, teacher } = require('../middleware/authMiddleware.js');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/login-teacher', loginTeacher);
router.post('/add-teacher', protect, addTeacher);

// Profile routes — must be BEFORE /:id/* wildcard routes
router.get('/profile', protect, getUserProfile);
router.put('/profile/photo', protect, uploadProfilePhoto);

// Student management
router.get('/getStudents', protect, teacher, getStudents);
router.delete('/delete-student/:id', protect, teacher, deleteStudent);

// Parameterized routes — always LAST to avoid catching static paths above
router.put('/:id/status', protect, teacher, updateStudentStatus);

module.exports = router;