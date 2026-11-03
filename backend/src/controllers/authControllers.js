const logger = require("../utils/logger");

const authService = require("../services/authServices");

// sign in / sign up with a verified Google Workspace account
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    const result = await authService.googleAuth(credential);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in googleAuth controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  googleAuth,
};
