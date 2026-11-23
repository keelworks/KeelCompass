const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const AdminAuditLog = db.AdminAuditLog;
const User = db.User;

// records an admin action - never throws, since a logging failure shouldn't
// block the action it's logging
const logAction = async (adminUserId, action, targetType = null, targetId = null, details = null) => {
  try {
    await AdminAuditLog.create({
      admin_user_id: adminUserId,
      action,
      target_type: targetType,
      target_id: targetId,
      details: details ? JSON.stringify(details) : null,
    });
  } catch (error) {
    logger.error(`Failed to record audit log entry: ${error.message}`);
  }
};

const getAuditLog = async () => {
  try {
    const entries = await AdminAuditLog.findAll({
      include: [{ model: User, as: "admin", attributes: ["id", "username", "email", "display_name"] }],
      order: [["created_at", "DESC"]],
      limit: 200,
    });
    return entries.map((e) => ({
      id: e.id,
      action: e.action,
      targetType: e.target_type,
      targetId: e.target_id,
      details: e.details ? JSON.parse(e.details) : null,
      createdAt: e.created_at,
      admin: {
        id: e.admin?.id,
        username: e.admin?.username,
        email: e.admin?.email,
        displayName: e.admin?.display_name,
      },
    }));
  } catch (error) {
    logEverything(error, "auditLogServices");
    throw new HttpError(500, "Error retrieving audit log");
  }
};

module.exports = { logAction, getAuditLog };
