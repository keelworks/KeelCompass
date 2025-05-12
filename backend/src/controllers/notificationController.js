const notificationService = require("../services/notificationService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { User } = require("../models/User");

// Created method named "getAllUserIds" to fetch all the userIds
const getAllUserIds = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id'], // fetch only the 'id' column
      raw: true,          
    });
    return users.map(user => user.id); // extract IDs into an array
  }
   catch (error) {
    throw new Error("Failed to fetch user IDs: " + error.message);
  }
};

// create notifications for specific users (question/comment update)
const createUpdateNotifications = async (req, res) => {
  
  try{
    const {userIds,type, message, targetUrl} = req.body;
    if(!Array.isArray(userIds) || userIds.length===0 || !type || !message){
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Invalid Request. 'userIds','type', and 'message' are required.",
      });
    }
    const count= await notificationService.createNotificationsForUsers(userIds,type,message,targetUrl);
    return res.status(HttpStatusCodes.CREATED).json({
      message:"Notification created successfully",
      count:count,
    });
  }
  catch(error){
    ServiceErrorHandler(error,res,logger,"createUpdateNotifications");
  }
};

// create notifications for all users (system announcement)
const createSystemNotifications = async (req, res) => {
  
  try{
    const {type, message, targetUrl} = req.body;
    if(!type || !message){
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Invalid Request. 'type' and 'message' are required.",
      });
    }
    const allUsersIds= await getAllUserIds(); // Created a method to get all the userIds
    const count= await notificationService.createNotificationsForUsers(allUsersIds,type,message,targetUrl);
    return res.status(HttpStatusCodes.CREATED).json({
      message:"Notifications created for all users",
      count:count,
    });
  }
  catch(error){
    ServiceErrorHandler(error,res,logger,"createSystemNotifications");
  }
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
