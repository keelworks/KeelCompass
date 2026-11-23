const logger = require("../utils/logger");

const userService = require("../services/userServices");

// get logged in user
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userService.getLoggedInUser(userId);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Caught in getMe controller: ${error.message}`);
    next(error);
  }
};

// get user by id
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Caught in getUserById controller: ${error.message}`);
    next(error);
  }
};

// complete profile setup (choose a username)
const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    const token = await userService.updateMe(userId, username);
    res.status(200).json(token);
  } catch (error) {
    logger.error(`Caught in updateMe controller: ${error.message}`);
    next(error);
  }
};

// top contributors by reputation
const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await userService.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    logger.error(`Caught in getLeaderboard controller: ${error.message}`);
    next(error);
  }
};

// the signed-in user's own activity stats + badges
const getMyStats = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    logger.error(`Caught in getMyStats controller: ${error.message}`);
    next(error);
  }
};

// directory search for @mention autocomplete
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await userService.searchUsersForMention(q, req.user.id);
    res.status(200).json(results);
  } catch (error) {
    logger.error(`Caught in searchUsers controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getMe,
  getUserById,
  updateMe,
  getLeaderboard,
  getMyStats,
  searchUsers,
};
