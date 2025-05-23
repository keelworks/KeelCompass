const express = require("express");
const authRoutes = require("./authRoutes");
const questionRoutes = require("./questionRoutes.js");
const commentRoutes = require("./commentRoutes");
const interestRoutes = require("./interestRoutes");
const searchRoutes = require("./searchRoutes.js");
const notificationRoutes = require("./notificationRoutes");

const router = express.Router();

// routes
router.use("/api/auth", authRoutes);
router.use("/api/questions", questionRoutes);
router.use("/api/comments", commentRoutes);
router.use("/api/interests", interestRoutes);
router.use("/api/search", searchRoutes);
router.use("/api/notifications", notificationRoutes);

// static routes
router.use("/static/career", express.static("src/career"));
router.use("/static/education", express.static("src/education"));

module.exports = router;
