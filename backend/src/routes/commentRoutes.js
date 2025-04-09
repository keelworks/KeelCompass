const express = require("express");
const { body, query, validationResult } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createComment,
  getCommentListByQuestionID,
  updateComment,
  deleteCommentByID,
} = require("../controllers/commentController");
const { HttpStatusCodes } = require("../utils/httpError");

const router = express.Router();

// post comment
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

// get all comments by question id
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

// update comment
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

// delete comment by id
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
