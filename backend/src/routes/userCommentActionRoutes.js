const express = require("express");
const { body } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const userCommentActionController = require("../controllers/userCommentActionControllers");

const router = express.Router();

const commentActionValidation = [
  body("commentId").isInt({ gt: 0 }).withMessage("invalid commentId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// create comment action
router.post("/action", authenticator, commentActionValidation, userCommentActionController.createCommentAction);

// delete comment action
router.delete("/action", authenticator, commentActionValidation, userCommentActionController.deleteCommentAction);

module.exports = router;
