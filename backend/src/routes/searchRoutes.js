const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const searchControllers = require("../controllers/searchControllers");

const router = express.Router();
router.use(isUser);

const searchValidation = [
  body("query")
    .optional()
    .isString()
    .withMessage("Query must be a string."),
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
  body("tag").optional().isString().withMessage("Invalid tag."),
  body("status").optional().isIn(["pending", "approved", "rejected"]).withMessage("Invalid status."),
  body("dateFrom").optional().isISO8601().withMessage("dateFrom must be a valid date."),
  body("dateTo").optional().isISO8601().withMessage("dateTo must be a valid date."),
  handleValidationErrors,
];

// search questions by keyword
router.post("/", searchValidation, searchControllers.searchQuestionByKeyword);

module.exports = router;
