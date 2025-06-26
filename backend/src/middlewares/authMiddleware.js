const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  try {
    const decoded = verifyToken(token);

    // If the token is invalid, verifyToken returns null. Handle this case gracefully.
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    // Attach user information to the request object
    req.loginUser = {
      email: decoded.email,
      id: decoded.id,
    };
    next();
  } catch (error) {
    // This block will now only catch unexpected errors, not token validation failures.
    console.error("Unexpected error in authentication middleware:", error);
    return res.status(500).json({ error: "An unexpected server error occurred during authentication." });
  }
};

module.exports = authenticate;
