const User = require('../models/User');
const Test = require('../models/Test');

// @desc    Get all teachers with their created tests
// @route   GET /api/teachers/teachers-with-tests
// @access  Private/Teacher
const getTeachersWithTests = async (req, res) => {
    try {
        // Get all teachers
        const teachers = await User.find({ role: 'teacher' })
            .select('-password')
            .lean();

        // Get all tests with their creator info
        const tests = await Test.find({}).select('name date startTime endTime totalMarks createdBy').lean();

        // Map tests to their teacher
        const teachersWithTests = teachers.map((teacher) => {
            const teacherTests = tests.filter(
                (t) => t.createdBy && t.createdBy.toString() === teacher._id.toString()
            );
            return {
                ...teacher,
                tests: teacherTests,
                testCount: teacherTests.length,
            };
        });

        res.json(teachersWithTests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = { getTeachersWithTests };
