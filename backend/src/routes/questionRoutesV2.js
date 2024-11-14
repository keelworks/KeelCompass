// Question related routes

const { body, query, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestionList,
} = require("../controllers/questionControllerV2");

// POST /questions - Ask a question
router.post(
  "/",
  [
    body("loginUserID")
      .notEmpty()
      .withMessage("user ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid author ID"),
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .bail()
      .isString()
      .withMessage("invalid title"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      next();
    },
  ],
  createQuestion
);

// GET /questions - Get recent questions
router.get(
  "/",
  [
    query("count").isInt({ gt: 0 }).withMessage("invalid count").bail(),
    query("offset").isInt({ min: 0 }).withMessage("invalid offset").bail(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      next();
    },
  ],
  getQuestionList
);

module.exports = router;
