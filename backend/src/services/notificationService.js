const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const User = db.users;
const Notification = db.notifications;

// create notification for a single user
const createNotification = async (user_id, type, message, targetUrl) => {
  // create a notification for one user whenever their question gets approved/rejected
  // create a notification for one user whenever their question/comment gets liked/shared
  // these can be determined based on type
  // we do not need a controller/route for this service because we call it internally whenever admin updates a question's status or whenever a user likes/shares another user's question/comment
  try{
    const notification=await Notification.create({
      user_id,
      type,
      message,
      targetUrl,
      isRead: false,
    });

    return notification;
  }
  catch(error){
    console.log("error is:", error);
    logger.error('Error creating notification for user ${userId}: ${error.message}');
    throw new HttpError(500,"Failed to create notification.");
  }
};

// create notification for multiple users
const createNotificationsForUsers = async (userIds, type, message, targetUrl) => {
  // create a notification for all users who liked a question/comment whenever that question/comment gets updated
  // create a notification for all users whenever we need to send out system notifications
  // these can be determined based on type
  try {
    const notifications = userIds.map((user_id) => ({
      user_id,
      type,
      message,
      targetUrl,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await Notification.bulkCreate(notifications);
    return result.length;
  } catch (error) {
    logger.error(`Error creating notifications for users: ${error.message}`);
    throw new HttpError(500, "Failed to create notifications");
  }
};

// create notificaiton for all users
const createSystemNotifications = async (type, message, targetUrl) => {
  try {
    const users = await User.findAll({ attributes: ["id"] });
    const userIds = users.map((user) => user.id);

    return await createNotificationsForUsers(userIds, type, message, targetUrl);
  } catch (error) {
    logger.error(`Error creating system notifications: ${error.message}`);
    throw new HttpError(500, "Failed to create system notifications");
  }
};

// get all notifications for a user
const getNotificationsByUserID = async (userId) => {
  // get all notifications for a user based on userId
  try {
    
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      raw: true                                 // retrieve plain objects instead of sequelizing instances
    });

    return notifications;
  } catch (error) {
    logger.error(`Failed to fetch the notifications: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch the notifications");
  }
};

// mark a notification as read
const markNotificationRead = async (notificationId, userId) => {
  // verify notification.userId is the same as userId (make sure that the notification we are updating is owned by the user)
  // update (patch) a notification to change the read attribute from false to true
  try {
    // Finding the notification and verifying its ownership by checking the user Id
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId
      }
    });

    // If the notification doesn't exist or doesn't belong to the user
    if (!notification) {
      logger.warn(`Notification ${notificationId} not found or does not belong to user ${userId}`);
      throw new HttpError(
        HttpStatusCodes.NOT_FOUND,
        "Notification not found or you don't have permission to update it"
      );
    }

    // Update the read status
    await notification.update({ read: true });
    
    logger.debug(`Marked notification ${notificationId} as read for user ${userId}`);
    return notification;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    
    logger.error(`Error marking notification ${notificationId} as read: ${error.message}`);
    throw new HttpError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update notification status"
    );
  }
};

module.exports = {
  createNotification,
  createNotificationsForUsers,
  createSystemNotifications,
  getNotificationsByUserID,
  markNotificationRead,
};
