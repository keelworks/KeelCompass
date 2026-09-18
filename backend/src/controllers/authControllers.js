const logger = require("../utils/logger");

const authService = require("../services/authServices");

// register (issues a verification code, does not log the user in yet)
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.register(username, email, password);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in register controller: ${error.message}`);
    next(error);
  }
};

// verify the code sent during registration/resend
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const token = await authService.verifyEmail(email, code);
    res.status(200).json(token);
  } catch (error) {
    logger.error(`Caught in verifyEmail controller: ${error.message}`);
    next(error);
  }
};

// resend a fresh verification code
const resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.resendCode(email);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in resendCode controller: ${error.message}`);
    next(error);
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const token = await authService.login(identifier, password);
    res.status(200).json(token);
  } catch (error) {
    logger.error(`Caught in login controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendCode,
  login,
};
