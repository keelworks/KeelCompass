// Question related routes

const { body, param, query, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteCommentByID,
  updateComment,
  getCommentListByQuestionID,
} = require("../controllers/commentController");
const authenticator = require("../middlewares/authMiddleware");

// Create a comment
router.post(
  "/",
  authenticator,
  [
    body("questionID")
      .notEmpty()
      .withMessage("question ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid question ID"),
    body("content").notEmpty().withMessage("content is required").bail().isString().withMessage("invalid content"),
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
  createComment
);

// Get comment list of a question
router.get(
  "/",
  [
    query("questionID")
      .notEmpty()
      .withMessage("question ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid question ID"),
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
  getCommentListByQuestionID
);

// Update a comment
router.put(
  "/",
  authenticator,
  [
    body("commentID")
      .notEmpty()
      .withMessage("comment ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid comment ID"),
    body("content").notEmpty().withMessage("content is required").bail().isString().withMessage("invalid content"),
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
  updateComment
);

// Delete a comment by ID
router.delete(
  "/",
  authenticator,
  [
    query("commentID")
      .notEmpty()
      .withMessage("comment ID is required")
      .isInt({ gt: 0 })
      .withMessage("invalid comment ID")
      .bail(),
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
  deleteCommentByID
);

module.exports = router;
