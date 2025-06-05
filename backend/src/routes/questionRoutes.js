const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createQuestion,
  getRecentQuestions,
  getPopularQuestions,
  getQuestionByID,
  updateQuestionByID,
  deleteQuestionByID,
  takeActionByQuestionID,
  removeActionByQuestionID,
} = require("../controllers/questionController");
const { HttpStatusCodes } = require("../utils/httpError");

const router = express.Router();

// post question
router.post(
  "/",
  authenticator,
  [
    body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
    body("attachment").optional().isArray().withMessage("attachment must be an array"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg).join(", ");
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    },
  ],
  createQuestion
);

// get recent questions
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
  getRecentQuestions
);

// get popular questions
router.get(
  "/popular",
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
  getPopularQuestions
);

// get question by id
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

// update question by id
router.put(
  "/",
  authenticator,
  [
    body("questionID").notEmpty().withMessage("question ID is required").bail().isInt({ gt: 0 }).withMessage("invalid question ID"),
    body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
    body("attachment").optional().isArray().withMessage("attachment must be an array"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg).join(", ");
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: errorMessages });
      }
      next();
    },
  ],
  updateQuestionByID
);

// delete question by id
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

// take action on question
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
  takeActionByQuestionID
);

// remove action on question
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
  removeActionByQuestionID
);

module.exports = router;
