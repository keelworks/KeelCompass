const logger = require("../utils/logger");
const { verifyToken } = require("../utils/jwtUtils");
const db = require("../models");
const User = db.User;
const UserRole = db.UserRole;

module.exports = async function isUser(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized access" });
  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Fetch user from DB to get the role
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const userRoles = await UserRole.findAll({ where: { user_id: user.id } });

    req.user = { id: user.id, email: user.email, role: user.role, roles: userRoles.map((r) => r.role) };
    next();
  } catch (error) {
    logger.error(`Caught in isUser middleware: ${error.message}`);
    next(error);
  }
};