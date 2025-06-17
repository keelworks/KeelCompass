const express = require("express");
const { body, param } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createUpdateNotifications,
  createSystemNotifications,
  getNotificationsByUserId,
  markNotificationRead,
} = require("../controllers/notificationController");
const { handleValidationErrors } = require("../utils/validationUtils");

const router = express.Router();

const createUpdateNotificationsValidation = [
  body("userIds").isArray({ min: 1 }).withMessage("userIds must be a non-empty array"),
  body("type").notEmpty().withMessage("type is required"),
  body("message").notEmpty().withMessage("message is required"),
  handleValidationErrors,
];

const createSystemNotificationsValidation = [
  body("type").notEmpty().withMessage("type is required"),
  body("message").notEmpty().withMessage("message is required"),
  handleValidationErrors,
];

const markNotificationReadValidation = [
  param("id").isInt({ gt: 0 }).withMessage("invalid notification id"),
  handleValidationErrors,
];

// post notifications for specific users (question/comment update)
router.post("/updates", authenticator, createUpdateNotificationsValidation, createUpdateNotifications);

// post notifications for all users (system announcement)
router.post("/system", authenticator, createSystemNotificationsValidation, createSystemNotifications);

// get notifications for the logged-in user
router.get("/", authenticator, getNotificationsByUserId);

// mark a notification as read
router.patch("/:id/mark-read", authenticator, markNotificationReadValidation, markNotificationRead);

module.exports = router;
