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

  logger.debug(`get notifications by user ID request, loginUser = ${util.inspect(req.loginUser)}`);
  
  // use req.loginUser.id to identify the user
  const userId = req.loginUser.id;

  // call notificationService.getNotificationsByUserID(userId)
  notificationService
    .getNotificationsByUserID(userId)
    .then((notifications) => {
      // return the list of notifications
      return res.status(HttpStatusCodes.OK).json({ message: "success", notifications: notifications });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getNotificationsByUserID"));
};

// mark a notification as read
const markNotificationRead = async (req, res) => {
  logger.debug(`mark notification as read request, params = ${util.inspect(req.params)}, loginUser = ${util.inspect(req.loginUser)}`);
  
  // get notificationId from req.params.id
  const notificationId = req.params.id;

  // use req.loginUser.id to ensure the user owns the notification
  const userId = req.loginUser.id;

  // call notificationService.markNotificationRead(notificationId, userId)
  notificationService
    .markNotificationRead(notificationId, userId)
    .then(() => {
      // return success message
      // console.log("sameer");
      return res.status(HttpStatusCodes.OK).json({ message: "notification marked as read" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "markNotificationRead"));
};

module.exports = {
  createUpdateNotifications,
  createSystemNotifications,
  getNotificationsByUserID,
  markNotificationRead,
};
