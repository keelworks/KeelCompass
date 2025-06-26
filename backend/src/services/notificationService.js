const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const User = db.users;
const Notification = db.notifications;

// create a notification for a single user
const createNotification = async (user_id, type, message, target_url) => {
  try {
    const notification = await Notification.create({
      user_id,
      type,
      message,
      target_url,
      read: false,
    });
    return notification;
  } catch (error) {
    logger.error(`Error creating notification for user ${user_id}: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create notification');
  }
};

// create notifications for multiple users
const createNotificationsForUsers = async (userIds, type, message, target_url) => {
  try {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type,
      message,
      target_url,
      read: false,
    }));
    const result = await Notification.bulkCreate(notifications);
    return result;
  } catch (error) {
    logger.error(`Error creating notifications for users: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create notifications for users');
  }
};

// create system notification for all users
const createSystemNotifications = async (type, message, target_url) => {
  try {
    const users = await User.findAll({ attributes: ['id'], raw: true });
    const userIds = users.map((user) => user.id);
    return await createNotificationsForUsers(userIds, type, message, target_url);
  } catch (error) {
    logger.error(`Error creating system notifications: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create system notifications');
  }
};

// get all notifications for a user
const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      raw: true,
    });
    return notifications;
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch notifications');
  }
};

// mark a notification as read
const markNotificationRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
    if (!notification) {
      logger.warn(`Notification ${notificationId} not found or does not belong to user ${userId}`);
      throw new HttpError(HttpStatusCodes.BAD_REQUEST, "Notification not found or you don't have permission to update it");
    }
    notification.read = true;
    await notification.save();
    return notification;
  } catch (error) {
    logger.error(`Error marking notification as read: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to mark notification as read');
  }
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
  createSystemNotifications,
  getNotificationsByUserId,
  markNotificationRead,
};
