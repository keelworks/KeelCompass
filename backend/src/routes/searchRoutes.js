const express = require("express");
const { query } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { searchQuestionByKeyword } = require("../controllers/searchController");
const { handleValidationErrors } = require("../utils/validationUtils");

const router = express.Router();

const searchValidation = [
  query("query").notEmpty().withMessage("Search query is required").bail(),
  handleValidationErrors,
];

router.get(
  "/",
  authenticator, // Optional: remove if search needs to be made public
  searchValidation,
  searchQuestionByKeyword
);

module.exports = router;
