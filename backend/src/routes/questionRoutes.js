const express = require("express");
const { body, param, query } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const isFacilitator = require("../middlewares/isFacilitator");
const upload = require("../utils/multerConfig");
const questionControllers = require("../controllers/questionControllers");
const { createQuestionLimiter } = require("../middlewares/rateLimiters");

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
  body("categoryIds").optional().isString().withMessage("Invalid category IDs.").bail(),
  body("title").notEmpty().withMessage("Title is required").bail().isString().withMessage("Invalid title"),
  body("description").notEmpty().withMessage("Description is required").bail().isString().withMessage("Invalid description"),
  body("tags").optional().isString().withMessage("Invalid tags.").bail(),
  handleValidationErrors,
];

const updateQuestionValidation = [
  body("title").notEmpty().withMessage("Title is required.").bail().isString().withMessage("Invalid title."),
  body("description").notEmpty().withMessage("Description is required.").bail().isString().withMessage("Invalid description."),
  body("categoryIds").optional().isString().withMessage("Invalid category IDs.").bail(),
  body("tags").optional().isString().withMessage("Invalid tags.").bail(),
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

// list known tags a question can be restricted to
router.get("/tags", questionControllers.getKnownTags);

// find existing questions with a similar title (duplicate-question nudge)
router.get("/similar", questionControllers.getSimilarQuestions);

// get question by id
router.get("/:id", getQuestionByIdValidation, questionControllers.getQuestionById);

// post question
router.post("/", createQuestionLimiter, upload.single("attachment"), createQuestionValidation, questionControllers.createQuestion);

// update question by id
router.put("/:id", upload.single("attachment"), updateQuestionValidation, questionControllers.updateQuestion);

// update question status (facilitator)
router.patch("/:id/status", isFacilitator, updateQuestionStatusValidation, questionControllers.updateQuestionStatus);

// mark/unmark a comment as the accepted answer (question author or admin)
router.patch("/:id/accept-answer", getQuestionByIdValidation, questionControllers.setAcceptedAnswer);

// mute/unmute a thread for the signed-in user only
router.post("/:id/mute", getQuestionByIdValidation, questionControllers.muteQuestion);
router.delete("/:id/mute", getQuestionByIdValidation, questionControllers.unmuteQuestion);

// prior saved versions of this question's title/description
router.get("/:id/history", getQuestionByIdValidation, questionControllers.getQuestionHistory);

// delete question by id
router.delete("/:id", deleteQuestionValidation, questionControllers.deleteQuestion);

module.exports = router;
