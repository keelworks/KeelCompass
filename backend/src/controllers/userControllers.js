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

module.exports = {
  getMe,
  getUserById,
};
