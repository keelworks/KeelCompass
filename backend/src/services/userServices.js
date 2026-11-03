const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { generateToken } = require("../utils/jwtUtils");

const db = require("../models");
const User = db.User;
const UserRole = db.UserRole;

const USER_ATTRIBUTES = ['id', 'username', 'email', 'role', 'picture_url', 'raw_role_tag', 'full_role_tag', 'display_name', 'created_at', 'updated_at'];

// flatten the `userRoles` association into a plain `roles: string[]` field
const withRoles = (user) => {
  const { userRoles, ...rest } = user.toJSON();
  return { ...rest, roles: (userRoles || []).map((r) => r.role) };
};

// get logged in user
const getLoggedInUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: USER_ATTRIBUTES,
      include: [{ model: UserRole, as: 'userRoles', attributes: ['role'] }],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user data for user ID: ${userId}`);
    return withRoles(user);
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
      attributes: USER_ATTRIBUTES,
      include: [{ model: UserRole, as: 'userRoles', attributes: ['role'] }],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user by ID: ${userId}`);
    return withRoles(user);
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user");
  }
};

// complete profile setup (first login via Google) by choosing a username
const updateMe = async (userId, username) => {
  try {
    const trimmedUsername = (username || "").trim();
    if (!trimmedUsername) throw new HttpError(400, "Username is required.");

    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    await user.update({ username: trimmedUsername });

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    logger.info(`Profile completed for user ID: ${userId}`);
    return token;
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating profile");
  }
};

module.exports = {
  getLoggedInUser,
  getUserById,
  updateMe,
};
