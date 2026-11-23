const express = require("express");
const { getMe, getUserById, updateMe, getLeaderboard, getMyStats, searchUsers } = require("../controllers/userControllers");
const isUser = require("../middlewares/isUser");

const router = express.Router();

// get logged in user
router.get("/me", isUser, getMe);

// complete profile setup (choose a username)
router.patch("/me", isUser, updateMe);

// the signed-in user's own activity stats + badges
router.get("/me/stats", isUser, getMyStats);

// top contributors by reputation
router.get("/leaderboard", isUser, getLeaderboard);

// @mention autocomplete directory search - registered before the generic
// /:userId route so "search" isn't swallowed as a userId param
router.get("/search", isUser, searchUsers);

// get user by id
router.get("/:userId", isUser, getUserById);

module.exports = router;
