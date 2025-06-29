const express = require("express");
const { body, param, query } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");
const upload = require("../utils/multerConfig");

const questionControllers = require("../controllers/questionControllers");

const router = express.Router();

const getQuestionsValidation = [
  query("count").isInt({ gt: 0 }).withMessage("Invalid count.").bail(),
  query("offset").isInt({ min: 0 }).withMessage("Invalid offset.").bail(),
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

const deleteQuestionValidation = [
  param("id").notEmpty().withMessage("Question ID is required.").isInt({ gt: 0 }).withMessage("Invalid question ID."),
  handleValidationErrors,
];

// get recent questions
router.get("/", getQuestionsValidation, questionControllers.getRecentQuestions);

// get popular questions
router.get("/popular", getQuestionsValidation, questionControllers.getPopularQuestions);

// post question
router.post("/", authenticator, upload.single("attachment"), createQuestionValidation, questionControllers.createQuestion);

// update question by id
router.put("/:id", authenticator, upload.single("attachment"), updateQuestionValidation, questionControllers.updateQuestion);

// delete question by id
router.delete("/:id", authenticator, deleteQuestionValidation, questionControllers.deleteQuestion);

module.exports = router;
