const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController.js");

// Health check
router.get("/health", controller.healthCheck);

// Password reset routes
router.post("/resetpassword", controller.passwordReset);
router.post("/verifyOTP", controller.verifyOTP);
router.post("/updatePassword", controller.updatePassword);

// User profile and signup routes
router.post("/signup", controller.signUp);
router.get("/profile/:userId", controller.getProfile);
router.put("/profile/:userId", controller.updateProfile);

module.exports = router;
