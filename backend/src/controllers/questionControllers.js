const logger = require("../utils/logger");

const questionService = require("../services/questionServices");

// multipart form fields arrive as strings; parse a JSON-encoded tags array
// sent from the create/edit question forms
const parseTags = (raw) => {
  if (raw === undefined) return undefined;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

// get recent questions
const getRecentQuestions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { count, offset } = req.query;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;
    const viewerTag = req.user?.raw_role_tag ?? null;

    const result = await questionService.getRecentQuestions(userId, count, offset, viewerTag, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getRecentQuestions controller: ${error.message}`);
    next(error);
  }
};

// get popular questions
const getPopularQuestions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { count, offset } = req.query;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;
    const viewerTag = req.user?.raw_role_tag ?? null;

    const result = await questionService.getPopularQuestions(userId, count, offset, viewerTag, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getPopularQuestions controller: ${error.message}`);
    next(error);
  }
};

// get pending questions (facilitator)
const getPendingQuestions = async (req, res, next) => {
try {
    const userId = req.user?.id;
    const { count, offset } = req.query;

    const result = await questionService.getPendingQuestions(userId, count, offset);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getPendingQuestions controller: ${error.message}`);
    next(error);
  }
};

// list every known tag a question can be restricted to
const getKnownTags = async (req, res, next) => {
  try {
    const tags = await questionService.getKnownTags();
    return res.status(200).json(tags);
  } catch (error) {
    logger.error(`Caught in getKnownTags controller: ${error.message}`);
    next(error);
  }
};

// get question by id
const getQuestionById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;
    const viewerTag = req.user?.raw_role_tag ?? null;

    const result = await questionService.getQuestion(userId, id, viewerTag, isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getQuestionById controller: ${error.message}`);
    next(error);
  }
};

// create question
const createQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { categoryIds, title, description, tags } = req.body;
    const attachment = req.file;

    const questionId = await questionService.createQuestion(userId, categoryIds, title, description, attachment, parseTags(tags) ?? []);
    return res.status(201).json(questionId);
  } catch (error) {
    logger.error(`Caught in createQuestion controller: ${error.message}`);
    next(error);
  }
};

// update question by id
const updateQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;
    const { title, description, tags } = req.body;
    const attachment = req.file;

    const updatedId = await questionService.updateQuestion(userId, questionId, title, description, attachment, parseTags(tags));
    return res.status(200).json(updatedId);
  } catch (error) {
    logger.error(`Caught in updateQuestion controller: ${error.message}`);
    next(error);
  }
};

// update question status (facilitator)
const updateQuestionStatus = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const { status } = req.body;

    const updatedId = await questionService.updateQuestionStatus(questionId, status);
    return res.status(200).json(updatedId);
  } catch (error) {
    logger.error(`Caught in updateQuestionStatus controller: ${error.message}`);
    next(error);
  }
}

// delete question by id
const deleteQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    await questionService.deleteQuestion(userId, questionId);
    return res.status(200).json({ message: "Question deleted successfully", questionId });
  } catch (error) {
    logger.error(`Caught in deleteQuestion controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getRecentQuestions,
  getPopularQuestions,
  getPendingQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
  getKnownTags,
};
