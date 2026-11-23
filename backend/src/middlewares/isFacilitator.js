const logger = require("../utils/logger");

// allows the legacy facilitator role, or either of the RBAC admin/manager
// roles - without this, an RBAC admin couldn't reach the moderation routes
// at all, since those two role systems were never connected
module.exports = function isFacilitator(req, res, next) {
  try {
    const isLegacyFacilitator = req.user && req.user.role === 'facilitator';
    const isRbacModerator = req.user?.roles?.some((r) => r === 'admin' || r === 'manager');
    if (isLegacyFacilitator || isRbacModerator) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Facilitator access only.' });
  } catch (error) {
    logger.error(`Caught in isFacilitator middleware: ${error.message}`);
    next(error);
  }
}
