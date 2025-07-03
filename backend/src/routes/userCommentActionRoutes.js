const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const userCommentActionController = require("../controllers/userCommentActionControllers");

const router = express.Router();
router.use(isUser);

const commentActionValidation = [
  body("commentId").isInt({ gt: 0 }).withMessage("invalid commentId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// create comment action
router.post("/action", commentActionValidation, userCommentActionController.createCommentAction);

// delete comment action
router.delete("/action", commentActionValidation, userCommentActionController.deleteCommentAction);

module.exports = router;
