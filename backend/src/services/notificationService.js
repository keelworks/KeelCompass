const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const User = db.users;
const Notification = db.notifications;

// create notification for a single user
const createNotification = async (userId, type, message, targetUrl) => {
  // create a notification for one user whenever their question gets approved/rejected
  // create a notification for one user whenever their question/comment gets liked/shared
  // these can be determined based on type
  // we do not need a controller/route for this service because we call it internally whenever admin updates a question's status or whenever a user likes/shares another user's question/comment
};

// create notification for multiple users
const createNotificationsForUsers = async (userIds, type, message, targetUrl) => {
  // create a notification for all users who liked a question/comment whenever that question/comment gets updated
  // create a notification for all users whenever we need to send out system notifications
  // these can be determined based on type
};

// get all notifications for a user
const getNotificationsByUserID = async (userId) => {
  // get all notifications for a user based on userId
};

// mark a notification as read
const markNotificationRead = async (notificationId, userId) => {
  // verify notification.userId is the same as userId (make sure that the notification we are updating is owned by the user)
  // update (patch) a notification to change the read attribute from false to true
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
  getNotificationsByUserID,
  markNotificationRead,
};
