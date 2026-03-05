const AuditLog = require('../models/AuditLog');

// @desc    Get recent audit activity (last 20 entries)
// @route   GET /api/audit/recent
// @access  Private/Teacher
const getRecentActivity = async (req, res) => {
    try {
        const logs = await AuditLog.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = { getRecentActivity };
