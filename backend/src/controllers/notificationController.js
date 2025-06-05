const notificationService = require("../services/notificationService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { User } = require("../models/User");

// create notifications for specific users (question/comment update)
const createUpdateNotifications = async (req, res) => {
  try {
    const { userId, type, message, targetUrl } = req.body;

    if (!Array.isArray(userId) || userId.length === 0 || !type || !message) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Invalid Request. 'userId', 'type', and 'message' are required.",
      });
    }

    const count = await notificationService.createNotification(
      userId,
      type,
      message,
      targetUrl
    );

    return res.status(HttpStatusCodes.CREATED).json({
      message: "Notification created successfully",
      count,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "createUpdateNotifications");
  }
};

// create notifications for all users (system announcement)
const createSystemNotifications = async (req, res) => {
  try {
    const { type, message, targetUrl } = req.body;

    if (!type || !message) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Invalid Request. 'type' and 'message' are required.",
      });
    }

    const users = await User.findAll({ attributes: ['id'], raw: true });
    const allUserIds = users.map(user => user.id);

    const count = await notificationService.createNotificationsForUsers(
      allUserIds,
      type,
      message,
      targetUrl
    );

    return res.status(HttpStatusCodes.CREATED).json({
      message: "Notifications created for all users",
      count,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "createSystemNotifications");
  }
};

// get all notifications for a user
const getNotificationsByUserID = async (req, res) => {
  try {
    logger.debug(`get notifications by user ID request, loginUser = ${util.inspect(req.loginUser)}`);

    const userId = req.loginUser.id;
    const notifications = await notificationService.getNotificationsByUserID(userId);

    return res.status(HttpStatusCodes.OK).json({
      message: "success",
      notifications,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getNotificationsByUserID");
  }
};

// mark a notification as read
const markNotificationRead = async (req, res) => {
  try {
    logger.debug(`mark notification as read request, params = ${util.inspect(req.params)}, loginUser = ${util.inspect(req.loginUser)}`);

    const notificationId = req.params.id;
    const userId = req.loginUser.id;

    await notificationService.markNotificationRead(notificationId, userId);

    return res.status(HttpStatusCodes.OK).json({
      message: "notification marked as read",
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "markNotificationRead");
  }
};

module.exports = {
  createUpdateNotifications,
  createSystemNotifications,
  getNotificationsByUserID,
  markNotificationRead,
};
