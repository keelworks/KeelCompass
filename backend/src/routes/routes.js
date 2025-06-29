const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const searchRoutes = require("./searchRoutes.js");
const questionRoutes = require("./questionRoutes.js");
const userQuestionActionRoutes = require("./userQuestionActionRoutes");
const commentRoutes = require("./commentRoutes");
const userCommentActionRoutes = require("./userCommentActionRoutes");
const interestRoutes = require("./interestRoutes");
const notificationRoutes = require("./notificationRoutes");


// routes
router.use("/api/auth", authRoutes);
router.use("/api/search", searchRoutes);
router.use("/api/questions", questionRoutes);
router.use("/api/question-actions", userQuestionActionRoutes);
router.use("/api/comments", commentRoutes);
router.use("/api/comment-actions", userCommentActionRoutes);
router.use("/api/interests", interestRoutes);
router.use("/api/notifications", notificationRoutes);

// static routes
router.use("/static/career", express.static("src/career"));
router.use("/static/education", express.static("src/education"));

module.exports = router;
