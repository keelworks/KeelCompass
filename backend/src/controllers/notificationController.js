const notificationService = require("../services/notificationService");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// get all notifications for a user
const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.loginUser.id;
    const notifications = await notificationService.getNotificationsByUserId(userId);
    return res.status(HttpStatusCodes.OK).json({ message: "success", notifications });
  } catch (error) {
    ServiceErrorHandler(error, res, "getNotificationsByUserId");
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
  markNotificationRead,
};
