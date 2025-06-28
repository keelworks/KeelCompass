const express = require("express");
const { body, query, param } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");
const upload = require("../utils/multerConfig");

const commentController = require("../controllers/commentControllers");

const router = express.Router();

const getCommentsValidation = [
  query("questionId").notEmpty().withMessage("Question ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid question ID.").toInt(),
  query("count").isInt({ gt: 0 }).withMessage("Invalid count.").bail().toInt(),
  query("offset").isInt({ min: 0 }).withMessage("Invalid offset.").bail().toInt(),
  handleValidationErrors,
];

const createCommentValidation = [
  body("questionId").notEmpty().withMessage("Question ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid question ID."),
  body("content").notEmpty().withMessage("Content is required.").bail().isString().withMessage("Invalid content."),
  body("parentId").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("Invalid parent ID."),
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

// get all comments by question id
router.get("/", getCommentsValidation, commentController.getCommentsByQuestionId);

// create comment
router.post("/", authenticator, upload.single("attachment"), createCommentValidation, commentController.createComment);

// update comment by id
router.put("/:id", authenticator, upload.single("attachment"), updateCommentValidation, commentController.updateComment);

// delete comment by id
router.delete("/:id", authenticator, deleteCommentValidation, commentController.deleteComment);

module.exports = router;
