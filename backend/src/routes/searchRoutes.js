const express = require("express");
const { body } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const searchControllers = require("../controllers/searchControllers");

const router = express.Router();

const searchValidation = [
  body("query").notEmpty().withMessage("Search query is required.").bail().isString().withMessage("Query must be a string."),
  body("count").optional().isInt({ gt: 0 }).withMessage("Count must be a positive integer.").toInt(),
  body("offset").optional().isInt({ min: 0 }).withMessage("Offset must be a non-negative integer.").toInt(),
  body("categoriesIds").optional().custom((value) => {
    if (Array.isArray(value)) {
      if (!value.every(v => !isNaN(parseInt(v)))) throw new Error("Each value in categoriesIds array must be an integer.");
    } else if (typeof value === 'string') {
      if (!value.split(',').every(v => !isNaN(parseInt(v.trim())))) throw new Error("Each value in categoriesIds string must be a comma-separated integer.");
    } else if (value !== undefined) {
      throw new Error("Invalid categoriesIds.");
    }
    return true;
  }),
  body("hasNone").optional().isBoolean().withMessage("hasNone must be a boolean."),
  handleValidationErrors,
];

// search questions by keyword
router.post("/", authenticator, searchValidation, searchControllers.searchQuestionByKeyword);

module.exports = router;
