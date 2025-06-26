const express = require("express");
const { body, query } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createComment,
  getCommentsByQuestionId,
  updateCommentById,
  deleteCommentById,
  takeActionByCommentId,
  removeActionByCommentId,
} = require("../controllers/commentController");
const { handleValidationErrors } = require("../utils/validationUtils");
const upload = require("../utils/multerConfig");

const router = express.Router();

const createCommentValidation = [
  body("questionId").notEmpty().withMessage("question ID is required").bail().isInt({ gt: 0 }).withMessage("invalid question ID"),
  body("content").notEmpty().withMessage("content is required").bail().isString().withMessage("invalid content"),
  body("parentId").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("invalid parent ID"),
  handleValidationErrors,
];

const getCommentsValidation = [
  query("questionId").notEmpty().withMessage("question ID is required").bail().isInt({ gt: 0 }).withMessage("invalid question ID"),
  query("count").isInt({ gt: 0 }).withMessage("invalid count").bail(),
  query("offset").isInt({ min: 0 }).withMessage("invalid offset").bail(),
  handleValidationErrors,
];

const updateCommentValidation = [
  body("commentId").notEmpty().withMessage("comment ID is required").bail().isInt({ gt: 0 }).withMessage("invalid comment ID"),
  body("content").notEmpty().withMessage("content is required").bail().isString().withMessage("invalid content"),
  handleValidationErrors,
];

const deleteCommentValidation = [
  query("commentId").notEmpty().withMessage("comment ID is required").isInt({ gt: 0 }).withMessage("invalid comment ID").bail(),
  handleValidationErrors,
];

const commentActionValidation = [
  body("commentId").isInt({ gt: 0 }).withMessage("invalid commentId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// post comment
router.post("/", authenticator, upload.single("attachment"), createCommentValidation, createComment);

// get comments by question id
router.get("/", getCommentsValidation, getCommentsByQuestionId);

// update comment
router.put("/", authenticator, upload.single("attachment"), updateCommentValidation, updateCommentById);

// delete comment by id
router.delete("/", authenticator, deleteCommentValidation, deleteCommentById);

// take action on comment
router.post("/action", authenticator, commentActionValidation, takeActionByCommentId);

// remove action on comment
router.delete("/action", authenticator, commentActionValidation, removeActionByCommentId);

module.exports = router;
