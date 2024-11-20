// const { verifyToken } = require('../utils/jwtUtils');

// const authenticate = (req, res, next) => {
//     const token = req.cookies.jwtToken || req.header('Authorization')?.replace('Bearer ', ''); // Checking for token in cookies or Authorization header

//     if (!token) {
//         return res.status(401).json({ error: "Unauthorized access." });
//     }

//     try {
//         const decoded = verifyToken(token);
//         if (!decoded) {
//             return res.status(401).json({ error: "Invalid or expired token." });
//         }

//         req.user = decoded.user; // Attach user info to the request object
//         next(); // Proceed to the next middleware/route handler
//     } catch (error) {
//         return res.status(401).json({ error: "Invalid or expired token." });
//     }
// };

// module.exports = authenticate;
const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token:", token); 
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized access." });
    }

    try {
        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token." });
        }

        // Attach user information to the request object
        req.userEmail = decoded.email;
        req.userId = decoded.id;
        console.log("Decoded ----:", decoded);
        console.log("Decoded USER ----:", req.userEmail);
        console.log("Decoded USERID ----:", req.userId);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token. 99" });
    }
};

module.exports = authenticate;
