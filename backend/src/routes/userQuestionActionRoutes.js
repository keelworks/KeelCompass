const express = require("express");
const { body } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const userQuestionActionController = require("../controllers/userQuestionActionControllers");

const router = express.Router();

const questionActionValidation = [
  body("questionId").isInt({ gt: 0 }).withMessage("invalid questionId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// create question action
router.post("/action", authenticator, questionActionValidation, userQuestionActionController.createQuestionAction);

// delete question action
router.delete("/action", authenticator, questionActionValidation, userQuestionActionController.deleteQuestionAction);

module.exports = router;
