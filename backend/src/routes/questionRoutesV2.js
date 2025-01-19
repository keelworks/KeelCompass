// Question related routes

const { body, param, query, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const express = require("express");
const router = express.Router();
const authenticator = require("../middlewares/authMiddleware");
const {
  createQuestion,
  getQuestionList,
  deleteQuestionByID,
  updateQuestion,
  getQuestionByID,
  takeAction,
  removeAction,
} = require("../controllers/questionControllerV2");

// POST /questions - Ask a question
router.post(
  "/",
  authenticator,
  [
    body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
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
  createQuestion
);

// GET /questions - Get a question by ID
router.get(
  "/:questionID",
  [
    param("questionID").isInt({ gt: 0 }).withMessage("questionID"),
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
  getQuestionByID
);

// Get recent questions
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
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    },
  ],
  getQuestionList
);

// Update a question
router.put(
  "/",
  authenticator,
  [
    body("questionID")
      .notEmpty()
      .withMessage("question ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid question ID"),
    body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
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
  updateQuestion
);

// Delete a question by ID
router.delete(
  "/",
  authenticator,
  [
    query("questionID").isInt({ gt: 0 }).withMessage("invalid questionID").bail(),
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
  deleteQuestionByID
);

// Take an action on a question
router.post(
  "/action",
  authenticator,
  [
    body("questionID").isInt({ gt: 0 }).withMessage("invalid questionID").bail(),
    body("actionType").notEmpty().withMessage("actionType is required").bail(),
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
  takeAction
);

// Delete an action on a question
router.delete(
  "/action",
  authenticator,
  [
    body("questionID").isInt({ gt: 0 }).withMessage("invalid questionID").bail(),
    body("actionType").notEmpty().withMessage("actionType is required").bail(),
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
  removeAction
);

module.exports = router;
