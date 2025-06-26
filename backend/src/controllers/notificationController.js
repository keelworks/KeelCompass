const notificationService = require("../services/notificationService");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// get all notifications by user id
const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.loginUser.id;
    const notifications = await notificationService.getNotificationsByUserId(userId);
    return res.status(HttpStatusCodes.OK).json({ message: "success", notifications });
  } catch (error) {
    ServiceErrorHandler(error, res, "getNotificationsByUserId");
  }
};

// create notifications for all users (system announcement)
const createSystemNotifications = async (req, res) => {
  try {
    const { message, targetUrl } = req.body;
    if (!message) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Invalid Request. 'message' is required."
      });
    }
    const type = 'announcement';
    const result = await notificationService.createSystemNotifications(type, message, targetUrl);
    return res.status(HttpStatusCodes.CREATED).json({
      message: "All users notified successfully",
      count: Array.isArray(result) ? result.length : undefined
    });
  } catch (error) {
    ServiceErrorHandler(error, res, "createSystemNotifications");
  }
};

// mark a notification as read
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.loginUser.id;
    const notificationId = req.params.id;
    const notification = await notificationService.markNotificationRead(notificationId, userId);
    return res.status(HttpStatusCodes.OK).json({ message: "Notification marked as read", notification });
  } catch (error) {
    ServiceErrorHandler(error, res, "markNotificationRead");
  }
};

module.exports = {
  getNotificationsByUserId,
  createSystemNotifications,
  markNotificationRead,
};
