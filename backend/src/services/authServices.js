const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.User;

// register
const register = async (username, email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) throw new HttpError(409, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = generateToken({ id: newUser.id, email: newUser.email });
    logger.info(`User registered successfully with email ${email}`);
    return token;
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error registering user");
  }
};

// login
const login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new HttpError(401, "No user by that email");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpError(401, "Invalid password");

    const token = generateToken({ id: user.id, email: user.email });
    logger.info(`User logged in successfully with email: ${email}`);
    return token;
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error logging in user");
  }
};

module.exports = {
  register,
  login,
};
