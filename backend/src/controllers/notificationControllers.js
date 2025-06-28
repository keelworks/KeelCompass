const logger = require("../utils/logger");

const notificationService = require("../services/notificationServices");

// get all notifications by user id
const getNotificationsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const notifications = await notificationService.getNotificationsByUserId(userId);
    return res.status(200).json({ message: "Fetched notifications successfully", notifications });
  } catch (error) {
    logger.error(`Caught in getNotificationsByUserId controller: ${error.message}`);
    next(error);  }
};

// create notifications for all users
const createNotificationsForAllUsers = async (req, res, next) => {
  try {
    const { message, targetUrl } = req.body;
    const type = 'announcement';
    
    const result = await notificationService.createNotificationsForAllUsers(type, message, targetUrl);
    return res.status(200).json({ message: "All users notified successfully", count: result.length });
  } catch (error) {
    logger.error(`Caught in createNotificationsForAllUsers controller: ${error.message}`);
    next(error);  }
};

// mark notification as read
const markNotificationRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markNotificationRead(userId, notificationId);
    return res.status(200).json({ message: "Notification marked as read", notificationId: notification.id });
  } catch (error) {
    logger.error(`Caught in markNotificationRead controller: ${error.message}`);
    next(error);  }
};

module.exports = {
  getNotificationsByUserId,
  createNotificationsForAllUsers,
  markNotificationRead,
};
