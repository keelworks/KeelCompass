const express = require("express");
const { getMe, getUserById, updateMe } = require("../controllers/userControllers");
const isUser = require("../middlewares/isUser");

const router = express.Router();

// get logged in user
router.get("/me", isUser, getMe);

// complete profile setup (choose a username)
router.patch("/me", isUser, updateMe);

// get user by id
router.get("/:userId", isUser, getUserById);

module.exports = router;
