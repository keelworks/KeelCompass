const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Notification = db.Notification;

// get all notifications by user id
const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      raw: true,
    });
    logger.info(`Fetched notifications for user ${userId}`);
    return notifications;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to fetch notifications');
  }
};

// create a notification for a single user
const createNotification = async (userId, type, message, targetUrl) => {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type: type,
      message: message,
      target_url: targetUrl,
      read: false,
    });
    logger.info(`Notification created for user ${userId} [type: ${type}]`);
    return { message: "Notification created successfully", notificationId: notification.id };
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notification');
  }
};

// create notifications for multiple users
const createNotificationsForUsers = async (userIds, type, message, targetUrl) => {
  try {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type: type,
      message: message,
      target_url: targetUrl,
      read: false,
    }));
    const result = await Notification.bulkCreate(notifications);
    logger.info(`Created notifications for users: [${userIds.join(', ')}], type: ${type}`);
    return { message: "Notifications created successfully", notificationIds: result.map((notification) => notification.id) };
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notifications for users');
  }
};

// create notifications for all users
const createNotificationsForAllUsers = async (type, message, targetUrl) => {
  try {
    const users = await User.findAll({ attributes: ['id'], raw: true });
    const userIds = users.map((user) => user.id);
    const result = await createNotificationsForUsers(userIds, type, message, targetUrl);
    logger.info(`Created notifications for all users [count: ${userIds.length}], type: ${type}`);
    return { message: "Notifications created successfully", notificationIds: result.notificationIds };
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notifications for all users');
  }
};

// mark notification as read
const markNotificationRead = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
    if (!notification) throw new HttpError(400, "Notification not found or you don't have permission to update it");

    notification.read = true;
    await notification.save();
    logger.info(`Notification ${notificationId} marked as read for user ${userId}`);
    return { message: "Notification marked as read successfully", notificationId };
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to mark notification as read');
  }
};

module.exports = {
  getNotificationsByUserId,
  createNotification,
  createNotificationsForUsers,
  createNotificationsForAllUsers,
  markNotificationRead,
};
