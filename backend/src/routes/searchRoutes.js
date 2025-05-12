const express = require("express");
const { query, validationResult } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { searchQuestionByKeyword } = require("../controllers/searchController");
const { HttpStatusCodes } = require("../utils/httpError");

const router = express.Router();

router.get(
  "/",
  authenticator, // Optional: remove if search needs to be made public
  [
    query("query").notEmpty().withMessage("Search query is required").bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors
            .array()
            .map((error) => error.msg)
            .join(", ");
          return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    },
  ],
  searchQuestionByKeyword
);

module.exports = router;
