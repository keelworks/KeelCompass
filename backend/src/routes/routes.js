// defining routes to route request calls to corresponding methods

const controller = require("../controllers/controller.js");

const router = require("express").Router();

const articleRouter = require("./articleRoutes");
const questionRoutes = require("./questionRoutesV2");
const commentRoutes = require("./commentRoutes");
const tagRoutes = require("./tagRoutes");
const interestRoutes = require("./interestRoutes");
const authRoutes = require("./authRoutes");

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

module.exports = router;
