const logger = require("../utils/logger");

module.exports = function isFacilitator(req, res, next) {
  try {
    if (req.user && req.user.role === 'facilitator') {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Facilitator access only.' });
  } catch (error) {
    logger.error(`Caught in isFacilitator middleware: ${error.message}`);
    next(error);
  }
}
