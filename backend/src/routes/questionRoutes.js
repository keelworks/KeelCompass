const express = require("express");
const { body, param, query } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const isFacilitator = require("../middlewares/isFacilitator");
const upload = require("../utils/multerConfig");
const questionControllers = require("../controllers/questionControllers");

const router = express.Router();
router.use(isUser);

const getQuestionsValidation = [
  query("count").isInt({ gt: 0 }).withMessage("Invalid count.").bail(),
  query("offset").isInt({ min: 0 }).withMessage("Invalid offset.").bail(),
  handleValidationErrors,
];

const getQuestionByIdValidation = [
  param("id").notEmpty().isInt({ gt: 0 }).withMessage("Invalid question ID.").bail(),
  handleValidationErrors,
];

const createQuestionValidation = [
  body("categoryIds").optional().isArray().withMessage("Invalid category IDs.").bail(),
  body("title").notEmpty().withMessage("Title is required").bail().isString().withMessage("Invalid title"),
  body("description").notEmpty().withMessage("Description is required").bail().isString().withMessage("Invalid description"),
  handleValidationErrors,
];

const updateQuestionValidation = [
  body("title").notEmpty().withMessage("Title is required.").bail().isString().withMessage("Invalid title."),
  body("description").notEmpty().withMessage("Description is required.").bail().isString().withMessage("Invalid description."),
  body("categoryIds").optional().isArray().withMessage("Invalid category IDs.").bail(),
  handleValidationErrors,
];

const updateQuestionStatusValidation = [
  param("id").notEmpty().isInt({ gt: 0 }).withMessage("Invalid question ID."),
  body("status").notEmpty().withMessage("Status is required.").isString().withMessage("Status must be a string.").isIn(["approved", "rejected"]).withMessage("Status must be either 'approved' or 'rejected'."),
  handleValidationErrors,
];

const deleteQuestionValidation = [
  param("id").notEmpty().withMessage("Question ID is required.").isInt({ gt: 0 }).withMessage("Invalid question ID."),
  handleValidationErrors,
];

// get recent questions
router.get("/", getQuestionsValidation, questionControllers.getRecentQuestions);

// get popular questions
router.get("/popular", getQuestionsValidation, questionControllers.getPopularQuestions);

// get pending questions (facilitator)
router.get("/pending", isFacilitator, getQuestionsValidation, questionControllers.getPendingQuestions);

// get question by id
router.get("/:id", getQuestionByIdValidation, questionControllers.getQuestionById);

// post question
router.post("/", upload.single("attachment"), createQuestionValidation, questionControllers.createQuestion);

// update question by id
router.put("/:id", upload.single("attachment"), updateQuestionValidation, questionControllers.updateQuestion);

// update question status (facilitator)
router.patch("/:id/status", isFacilitator, updateQuestionStatusValidation, questionControllers.updateQuestionStatus);

// delete question by id
router.delete("/:id", deleteQuestionValidation, questionControllers.deleteQuestion);

module.exports = router;
