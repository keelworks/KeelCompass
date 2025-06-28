const express = require("express");
const { body, param } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const notificationController = require("../controllers/notificationControllers");

const router = express.Router();

const createNotificationsForAllUsersValidation = [
  body("message").notEmpty().withMessage("Message is required."),
  body("targetUrl").optional().isString(),
  handleValidationErrors,
];

const markNotificationReadValidation = [
  param("id").isInt({ gt: 0 }).withMessage("Invalid notification ID."),
  handleValidationErrors,
];

// get all notifications by user id
router.get("/", authenticator, notificationController.getNotificationsByUserId);

// create notifications for all users
router.post("/announcement", authenticator, createNotificationsForAllUsersValidation, notificationController.createNotificationsForAllUsers);

// mark notification as read
router.patch("/:id/mark-read", authenticator, markNotificationReadValidation, notificationController.markNotificationRead);

module.exports = router;
