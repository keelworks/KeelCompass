const express = require("express");
const { getMe, getUserById } = require("../controllers/userControllers");
const isUser = require("../middlewares/isUser");

const router = express.Router();

// get logged in user
router.get("/me", isUser, getMe);

// get user by id
router.get("/:userId", isUser, getUserById);

module.exports = router;
