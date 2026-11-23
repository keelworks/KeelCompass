const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const { createFeedback } = require("../controllers/feedbackControllers");

const router = express.Router();
router.use(isUser);

const createFeedbackValidation = [
  body("message").notEmpty().withMessage("Feedback message is required.").isString(),
  handleValidationErrors,
];

// submit feedback (any signed-in user)
router.post("/", createFeedbackValidation, createFeedback);

module.exports = router;
