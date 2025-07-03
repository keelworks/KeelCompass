const logger = require("../utils/logger");
const { verifyToken } = require("../utils/jwtUtils");

module.exports = function isUser(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized access" });
  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });
    
    req.user = {email: decoded.email, id: decoded.id};
    next();
  } catch (error) {
    logger.error(`Caught in isUser middleware: ${error.message}`);
    next(error);
  }
};
