const express = require("express");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const upload = require("../utils/multerConfig");
const commentController = require("../controllers/commentControllers");

const router = express.Router();
router.use(isUser);

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

// create comment
router.post("/", upload.single("attachment"), createCommentValidation, commentController.createComment);

// update comment by id
router.put("/:id", upload.single("attachment"), updateCommentValidation, commentController.updateComment);

// delete comment by id
router.delete("/:id", deleteCommentValidation, commentController.deleteComment);

module.exports = router;
