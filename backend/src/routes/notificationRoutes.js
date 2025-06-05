const express = require("express");
const { body, param, validationResult } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createUpdateNotifications,
  createSystemNotifications,
  getNotificationsByUserID,
  markNotificationRead,
} = require("../controllers/notificationController");
const { HttpStatusCodes } = require("../utils/httpError");

const router = express.Router();

// Create notifications for specific users (question/comment update)
router.post(
  "/updates",
  authenticator,
  [
    body("userId").isArray({ min: 1 }).withMessage("userIds must be a non-empty array"),
    body("type").notEmpty().withMessage("type is required"),
    body("message").notEmpty().withMessage("message is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(", ");
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    }
  ],
  createUpdateNotifications
);

// Create notifications for all users (system announcement)
router.post(
  "/system",
  authenticator,
  [
    body("type").notEmpty().withMessage("type is required"),
    body("message").notEmpty().withMessage("message is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(", ");
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    }
  ],
  createSystemNotifications
);

// Get all notifications for the logged-in user
router.get("/", authenticator, getNotificationsByUserID);

// Mark a specific notification as read
router.patch(
  "/:id/mark-read",
  authenticator,
  [
    param("id").isInt({ gt: 0 }).withMessage("invalid notification id"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(", ");
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    }
  ],
  markNotificationRead
);

module.exports = router;
