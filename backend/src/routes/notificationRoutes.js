const express = require("express");
const { param, validationResult } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  getNotificationsByUserId,
  markNotificationRead,
} = require("../controllers/notificationController");

const router = express.Router();

// get all notifications by user id
router.get("/", authenticator, getNotificationsByUserId);

// create notifications for all users (system announcement)
router.post(
  "/system",
  authenticator,
  [
    body("message").notEmpty().withMessage("message is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
      }
      next();
    }
  ],
  createSystemNotifications
);

// mark a notification as read
router.patch(
  "/:id/mark-read",
  authenticator,
  param("id").isInt({ gt: 0 }).withMessage("Notification ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(e => e.msg).join(", ") });
    }
    next();
  },
  markNotificationRead
);

module.exports = router;
