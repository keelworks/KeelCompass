const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    req.user = {
      email: decoded.email,
      id: decoded.id,
    };
    next();
  } catch (error) {
    console.error("Unexpected error in authentication middleware:", error);
    return res.status(500).json({ error: "An unexpected server error occurred during authentication." });
  }
};

module.exports = authenticate;
