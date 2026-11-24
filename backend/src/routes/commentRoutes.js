const express = require("express");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const upload = require("../utils/multerConfig");
const commentController = require("../controllers/commentControllers");
const { createCommentLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();
router.use(isUser);

const createCommentValidation = [
  body("questionId").notEmpty().withMessage("Question ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid question ID."),
  body("content").notEmpty().withMessage("Content is required.").bail().isString().withMessage("Invalid content."),
  body("parentId").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("Invalid parent ID."),
  // mentionedUserIds/mentionedGroupTags arrive either as a real JSON array
  // (reply path) or a JSON-encoded string (multipart top-level comment box),
  // and are parsed leniently in the controller - no stricter shape check
  // here, mirroring how mentionedUserIds has always been handled.
  body("mentionedGroupTags").optional(),
  handleValidationErrors,
];

const updateCommentValidation = [
  param("id").notEmpty().withMessage("Comment ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid comment ID."),
  body("content").notEmpty().withMessage("Content is required.").bail().isString().withMessage("Invalid content."),
  handleValidationErrors,
];

const deleteCommentValidation = [
  param("id").notEmpty().withMessage("Comment ID is required.").isInt({ gt: 0 }).withMessage("Invalid comment ID.").bail(),
  handleValidationErrors,
];

// create comment
router.post("/", createCommentLimiter, upload.single("attachment"), createCommentValidation, commentController.createComment);

// update comment by id
router.put("/:id", upload.single("attachment"), updateCommentValidation, commentController.updateComment);

// delete comment by id
router.delete("/:id", deleteCommentValidation, commentController.deleteComment);

// prior saved versions of this comment's content
router.get("/:id/history", commentController.getCommentHistory);

module.exports = router;
