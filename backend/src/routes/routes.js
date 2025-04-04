// defining routes to route request calls to corresponding methods
const express = require("express");
const controller = require("../controllers/controller.js");

const router = express.Router();

const articleRouter = require("./articleRoutes");
const questionRoutes = require("./questionRoutesV2");
const commentRoutes = require("./commentRoutes");
const tagRoutes = require("./tagRoutes");
const interestRoutes = require("./interestRoutes");
const authRoutes = require("./authRoutes");
const uploadRoutes = require("./uploadRoutes");

// Route for GET method -- a health check method
router.get("/health", controller.healthCheck);

router.post("/resetpassword", controller.passwordReset);

router.post("/verifyOTP", controller.verifyOTP);

router.post("/updatePassword", controller.updatePassword);

// Route for articles
// router.use("/api/articles", articleRouter);

// Route for tags
// router.use("/api/tags", tagRoutes);

// Register/Login authentication routes
router.use("/api/auth", authRoutes);

// Route for questions
router.use("/api/questions", questionRoutes);

router.use("/api/comments", commentRoutes);

router.use("/api/interests", interestRoutes);

router.use("/static/career", express.static("src/career"));
router.use("/static/education", express.static("src/education"));

// Upload file
router.use("/api/upload", uploadRoutes);

module.exports = router;
