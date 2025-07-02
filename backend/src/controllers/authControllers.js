const logger = require("../utils/logger");

const authService = require("../services/authServices");

// register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const token = await authService.register(username, email, password);
    res.status(201).json(token);
  } catch (error) {
    logger.error(`Caught in register controller: ${error.message}`);
    next(error);
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);
    res.status(200).json(token);
  } catch (error) {
    logger.error(`Caught in login controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login,
};
