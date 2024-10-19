const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes"); // Import the new user routes
const articleRouter = require("./articleRoutes");
const questionRoutes = require("./questionsRoutes");
const tagRoutes = require("./tagRoutes");

// Use user routes
router.use("/api/users", userRoutes);

// Route for articles
router.use("/api/articles", articleRouter);

// Route for tags
router.use("/api/tags", tagRoutes);

// Route for questions
router.use("/questions", questionRoutes);

module.exports = router;
