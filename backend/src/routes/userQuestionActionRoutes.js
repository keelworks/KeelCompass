const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const userQuestionActionController = require("../controllers/userQuestionActionControllers");

const router = express.Router();
router.use(isUser);

const questionActionValidation = [
  body("questionId").isInt({ gt: 0 }).withMessage("invalid questionId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// create question action
router.post("/action", questionActionValidation, userQuestionActionController.createQuestionAction);

// delete question action
router.delete("/action", questionActionValidation, userQuestionActionController.deleteQuestionAction);

module.exports = router;
