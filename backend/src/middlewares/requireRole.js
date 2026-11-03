const logger = require("../utils/logger");

module.exports = function requireRole(...allowed) {
  return function (req, res, next) {
    try {
      const roles = req.user?.roles || [];
      if (roles.some((role) => allowed.includes(role))) {
        return next();
      }
      return res.status(403).json({ error: `Forbidden: requires one of [${allowed.join(", ")}].` });
    } catch (error) {
      logger.error(`Caught in requireRole middleware: ${error.message}`);
      next(error);
    }
  };
};
