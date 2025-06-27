const db = require("../models");
const logger = require("../utils/logger");
const { HttpError } = require("../utils/httpError");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");

const User = db.user;

// register
const registerUser = async (username, email, password) => {
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new HttpError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = generateToken({ id: user.id, email: user.email });
    logger.info(`User registered successfully with email: ${email}`);
    return token;
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    throw error;
  }
};

// login
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpError(401, "No user found with the provided email address");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError(401, "Invalid password");
    }

    const token = generateToken({ id: user.id, email: user.email });
    logger.info(`User logged in successfully with email: ${email}`);
    return token;
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    throw error;
  }
};

// reset password
const resetUserPassword = async (username, email, newPassword) => {
  try {
    const user = await User.findOne({ where: { username, email } });
    if (!user) {
      throw new HttpError(401, "No user found with the provided email address");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    const token = generateToken({ id: user.id, email: user.email });
    logger.info(`User password reset successfully with email: ${email}`);
    return token;
  } catch (error) {
    logger.error(`Error resetting password: ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetUserPassword,
};
