const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;

// get logged in user
const getLoggedInUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user data for user ID: ${userId}`);
    return user;
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user data");
  }
};

// get user by id
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user by ID: ${userId}`);
    return user;
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user");
  }
};

module.exports = {
  getLoggedInUser,
  getUserById,
};
