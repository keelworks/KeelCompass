const db = require("../models");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const User = db.users;

// register
const registerUser = async (username, email, password) => {
  try {
    logger.info(`Registering user with email: ${email}`);
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new HttpError(HttpStatusCodes.BAD_REQUEST, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user.id, email: user.email });

    return token;
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error registering user.");
  }
};

// login
const loginUser = async (email, password) => {
  try {
    logger.info(`Logging in user with email: ${email}`);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

        const token = generateToken({ id: user.id, email: user.email });

    return token;
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error logging in user.");
  }
};

// reset password
const resetUserPassword = async (username, email, newPassword) => {
  try {
    logger.info(`Resetting password for user with email: ${email}`);
    const user = await User.findOne({ where: { username, email } });
    if (!user) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "User not found with provided username and email");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const token = generateToken({ id: user.id, email: user.email });

    return token;
  } catch (error) {
    logger.error(`Error resetting password: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error resetting password.");
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetUserPassword,
};
