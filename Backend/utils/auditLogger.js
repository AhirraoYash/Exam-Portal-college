const AuditLog = require('../models/AuditLog');

/**
 * Log a teacher action to the audit log.
 * @param {Object} options
 * @param {string} options.action       - Human-readable action string e.g. "Created Test"
 * @param {ObjectId|string} options.actorId   - ID of the user performing the action
 * @param {string} options.actorName    - Name of the user performing the action
 * @param {string} [options.targetId]   - ID of the affected resource (optional)
 * @param {string} [options.targetName] - Name/title of the affected resource (optional)
 * @param {Object} [options.meta]       - Extra data to store (optional)
 */
const logAction = async ({ action, actorId, actorName, targetId = null, targetName = null, meta = {} }) => {
    try {
        await AuditLog.create({
            action,
            actorId,
            actorName,
            targetId: targetId ? String(targetId) : null,
            targetName,
            meta,
        });
    } catch (err) {
        // Never crash the main request because of a logging failure
        console.error('[AuditLogger] Failed to write audit log:', err.message);
    }
};

module.exports = logAction;
