const authService = require("../services/authService");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const token = await authService.registerUser(username, email, password);
    res.status(HttpStatusCodes.CREATED).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "register");
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    res.status(HttpStatusCodes.OK).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "login");
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { username, email, newPassword } = req.body;
    const token = await authService.resetUserPassword(username, email, newPassword);
    res.status(HttpStatusCodes.OK).json({
      message: "Password updated successfully",
      token,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "resetPassword");
  }
};

module.exports = {
  register,
  login,
  resetPassword,
};
