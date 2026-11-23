const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { emitToUser } = require("../utils/socket");
const muteService = require("./muteServices");

const db = require("../models");
const User = db.User;
const Notification = db.Notification;

// get all notifications by user id
const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC'], ['id', 'DESC']],
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

// create a notification for a single user. `source` optionally tags the
// notification with where it came from ({ sourceType, sourceId, actorUserId,
// questionId }) so it can be found again and removed if the thing that
// caused it goes away (unlike, comment deletion, etc) instead of piling up
// forever. When `questionId` is present, a recipient who's muted that
// thread gets no notification at all rather than a silently-marked-read one.
const createNotification = async (userId, type, message, targetUrl, source = {}) => {
  try {
    if (source.questionId && (await muteService.isQuestionMuted(userId, source.questionId))) {
      return null;
    }
    const notification = await Notification.create({
      user_id: userId,
      type: type,
      message: message,
      target_url: targetUrl,
      read: false,
      source_type: source.sourceType ?? null,
      source_id: source.sourceId ?? null,
      actor_user_id: source.actorUserId ?? null,
    });
    logger.info(`Notification created for user ${userId} [type: ${type}]`);
    emitToUser(userId, "notification", notification.toJSON());
    return notification.id;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notification');
  }
};

// create notifications for multiple users
const createNotificationsForUsers = async (userIds, type, message, targetUrl, source = {}) => {
  try {
    if (source.questionId) {
      userIds = await muteService.filterOutMutedUserIds(userIds, source.questionId);
    }
    if (!userIds || userIds.length === 0) return [];
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type: type,
      message: message,
      target_url: targetUrl,
      read: false,
      source_type: source.sourceType ?? null,
      source_id: source.sourceId ?? null,
      actor_user_id: source.actorUserId ?? null,
    }));
    const result = await Notification.bulkCreate(notifications);
    logger.info(`Created notifications for users: [${userIds.join(', ')}], type: ${type}`);
    result.forEach((notification) => emitToUser(notification.user_id, "notification", notification.toJSON()));
    return result.map((notification) => notification.id);
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notifications for users');
  }
};

// create notifications for all users
const createNotificationsForAllUsers = async (type, message, targetUrl, excludeUserId = null, source = {}) => {
  try {
    const users = await User.findAll({ attributes: ['id'], raw: true });
    const userIds = users.map((user) => user.id).filter((id) => id !== excludeUserId);
    const result = await createNotificationsForUsers(userIds, type, message, targetUrl, source);
    logger.info(`Created notifications for all users [count: ${userIds.length}], type: ${type}`);
    return result;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to create notifications for all users');
  }
};

// remove notifications tied to a given source (e.g. a specific like or a
// specific comment) so that undoing the action - unliking, deleting a
// comment - also clears the notification(s) it caused, instead of leaving
// people's notification lists flooded with stale entries. When actorUserId
// is omitted, every notification from that source is removed regardless of
// who performed the original action (used when the source itself is gone,
// e.g. the comment was deleted).
const deleteNotificationsBySource = async (sourceType, sourceId, actorUserId = null) => {
  try {
    const where = { source_type: sourceType, source_id: sourceId };
    if (actorUserId !== null) where.actor_user_id = actorUserId;

    const toRemove = await Notification.findAll({ where, raw: true });
    if (toRemove.length === 0) return [];

    await Notification.destroy({ where });
    toRemove.forEach((n) => emitToUser(n.user_id, "notification:removed", { id: n.id }));
    logger.info(`Removed ${toRemove.length} notification(s) for source ${sourceType}:${sourceId}`);
    return toRemove.map((n) => n.id);
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to remove notifications');
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
    return notificationId;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, 'Failed to mark notification as read');
  }
};

// user-initiated deletion of a single notification (the "clear" button) -
// distinct from deleteNotificationsBySource, which is system-triggered
// cleanup when the thing that caused a notification goes away
const deleteNotification = async (userId, notificationId) => {
  try {
    const notification = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
    if (!notification) throw new HttpError(404, "Notification not found");
    await notification.destroy();
    logger.info(`Notification ${notificationId} deleted by user ${userId}`);
    return notificationId;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Failed to delete notification");
  }
};

// "clear all" - wipes every notification for this user
const deleteAllNotifications = async (userId) => {
  try {
    const count = await Notification.destroy({ where: { user_id: userId } });
    logger.info(`Cleared ${count} notification(s) for user ${userId}`);
    return count;
  } catch (error) {
    logEverything(error, "notificationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Failed to clear notifications");
  }
};

module.exports = {
  getNotificationsByUserId,
  createNotification,
  createNotificationsForUsers,
  createNotificationsForAllUsers,
  markNotificationRead,
  deleteNotificationsBySource,
  deleteNotification,
  deleteAllNotifications,
};
