const express = require("express");
const { body, param, query } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const { getMe, getUserById, updateMe, getLeaderboard, getMyStats, searchUsers } = require("../controllers/userControllers");
const isUser = require("../middlewares/isUser");

const router = express.Router();

const updateMeValidation = [
  body("username").notEmpty().withMessage("Username is required.").bail().isString().withMessage("Invalid username.").bail().isLength({ min: 2, max: 50 }).withMessage("Username must be between 2 and 50 characters."),
  handleValidationErrors,
];

const getUserByIdValidation = [
  param("userId").notEmpty().withMessage("User ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid user ID."),
  handleValidationErrors,
];

const searchUsersValidation = [
  query("q").notEmpty().withMessage("Search query is required.").bail().isString().withMessage("Invalid search query."),
  handleValidationErrors,
];

// get logged in user
router.get("/me", isUser, getMe);

// complete profile setup (choose a username)
router.patch("/me", isUser, updateMeValidation, updateMe);

// the signed-in user's own activity stats + badges
router.get("/me/stats", isUser, getMyStats);

// top contributors by reputation
router.get("/leaderboard", isUser, getLeaderboard);

// @mention autocomplete directory search - registered before the generic
// /:userId route so "search" isn't swallowed as a userId param
router.get("/search", isUser, searchUsersValidation, searchUsers);

// get user by id
router.get("/:userId", isUser, getUserByIdValidation, getUserById);

module.exports = router;
