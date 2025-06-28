const express = require("express");
const { query } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const searchControllers = require("../controllers/searchControllers");

const router = express.Router();

const searchValidation = [
  query("query").notEmpty().withMessage("Search query is required.").bail().isString().withMessage("Query must be a string."),
  query("count").optional().isInt({ gt: 0 }).withMessage("Count must be a positive integer.").toInt(),
  query("offset").optional().isInt({ min: 0 }).withMessage("Offset must be a non-negative integer.").toInt(),
  query("categoriesIds").optional().custom((value) => {
    if (typeof value === 'undefined' || value === null || value === '') return true;
    if (Array.isArray(value)) {
      if (!value.every(v => !isNaN(parseInt(v)))) throw new Error("Each value in categoriesIds array must be an integer.");
    } else if (typeof value === 'string') {
      if (!value.split(',').every(v => !isNaN(parseInt(v.trim())))) throw new Error("Each value in categoriesIds string must be a comma-separated integer.");
    } else {
      throw new Error("Invalid categoriesIds.");
    }
    return true;
  }),
  query("hasNone").optional().isBoolean().withMessage("hasNone must be a boolean."),
  handleValidationErrors,
];

// search questions by keyword
router.get("/", authenticator, searchValidation, searchControllers.searchQuestionByKeyword);

module.exports = router;
