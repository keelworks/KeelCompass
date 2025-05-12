const notificationService = require("../services/notificationService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// create notifications for specific users (question/comment update)
const createUpdateNotifications = async (req, res) => {
  // used when a question or comment is updated and we want to notify only specific users
  // body should have: userIds (array of IDs), type (string), message (string), targetUrl (optional string url that points to the quesition/comment)
  // call notificationService.createNotificationsForUsers(userIds, type, message, targetUrl)
  // return success message and count of notifications created
};

// create notifications for all users (system announcement)
const createSystemNotifications = async (req, res) => {
  // used for sending a system-wide announcement
  // body should have: type (string), message (string)
  // automatically target ALL users
  // internally call notificationService.createNotificationsForUsers(allUserIds, type, message, targetUrl)
  // return success message and count of notifications created
};

// get all notifications for a user
const getNotificationsByUserID = async (req, res) => {
  // fetch notifications for the currently logged-in user
  // use req.loginUser.id to identify the user
  // call notificationService.getNotificationsByUserID(userId)
  // return the list of notifications
};

// mark a notification as read
const markNotificationRead = async (req, res) => {
  // mark a single notification as read
  // get notificationId from req.params.id
  // use req.loginUser.id to ensure the user owns the notification
  // call notificationService.markNotificationRead(notificationId, userId)
  // return success message
};

module.exports = {
  createUpdateNotifications,
  createSystemNotifications,
  getNotificationsByUserID,
  markNotificationRead,
};
