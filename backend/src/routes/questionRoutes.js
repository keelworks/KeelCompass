const express = require("express");
const { body, param, query } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const {
  createQuestion,
  getRecentQuestions,
  getPopularQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  takeActionByQuestionId,
  removeActionByQuestionId,
} = require("../controllers/questionController");
const { handleValidationErrors } = require("../utils/validationUtils");
const upload = require("../utils/multerConfig");

const router = express.Router();

const createQuestionValidation = [
  body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
  handleValidationErrors,
];

const getQuestionsValidation = [
  query("count").isInt({ gt: 0 }).withMessage("invalid count").bail(),
  query("offset").isInt({ min: 0 }).withMessage("invalid offset").bail(),
  handleValidationErrors,
];

const getQuestionByIdValidation = [
  param("questionId").isInt({ gt: 0 }).withMessage("invalid questionId"),
  handleValidationErrors,
];

const updateQuestionValidation = [
  body("questionId").notEmpty().withMessage("question ID is required").bail().isInt({ gt: 0 }).withMessage("invalid question ID"),
  body("title").notEmpty().withMessage("title is required").bail().isString().withMessage("invalid title"),
  handleValidationErrors,
];

const deleteQuestionValidation = [
  query("questionId").isInt({ gt: 0 }).withMessage("invalid questionId").bail(),
  handleValidationErrors,
];

const questionActionValidation = [
  body("questionId").isInt({ gt: 0 }).withMessage("invalid questionId").bail(),
  body("actionType").notEmpty().withMessage("actionType is required").bail(),
  handleValidationErrors,
];

// post question
router.post("/", authenticator, upload.single("attachment"), createQuestionValidation, createQuestion);

// get recent questions
router.get("/", getQuestionsValidation, getRecentQuestions);

// get popular questions
router.get("/popular", getQuestionsValidation, getPopularQuestions);

// get question by id
router.get("/:questionId", getQuestionByIdValidation, getQuestionById);

// update question by id
router.put("/", authenticator, upload.single("attachment"), updateQuestionValidation, updateQuestionById);

// delete question by id
router.delete("/", authenticator, deleteQuestionValidation, deleteQuestionById);

// take action on question
router.post("/action", authenticator, questionActionValidation, takeActionByQuestionId);

// remove action on question
router.delete("/action", authenticator, questionActionValidation, removeActionByQuestionId);

module.exports = router;
