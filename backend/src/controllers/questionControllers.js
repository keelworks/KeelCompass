const logger = require("../utils/logger");

const questionService = require("../services/questionServices");
const muteService = require("../services/muteServices");

// multipart form fields arrive as strings; parse a JSON-encoded array sent
// from the create/edit question forms (used for both tags and categoryIds)
const parseJsonArray = (raw) => {
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
    const { count, offset, unanswered } = req.query;
    const viewerTag = req.user?.normalized_role_tag ?? null;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;

    const result = await questionService.getRecentQuestions(userId, count, offset, viewerTag, unanswered === "true", isAdmin);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getRecentQuestions controller: ${error.message}`);
    next(error);
  }
};

// find existing questions with a similar title (duplicate-question nudge)
const getSimilarQuestions = async (req, res, next) => {
  try {
    const { title } = req.query;
    const result = await questionService.getSimilarQuestions(title);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getSimilarQuestions controller: ${error.message}`);
    next(error);
  }
};

// get popular questions
const getPopularQuestions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { count, offset } = req.query;
    const viewerTag = req.user?.normalized_role_tag ?? null;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;

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
    const viewerTag = req.user?.normalized_role_tag ?? null;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;

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

    const questionId = await questionService.createQuestion(userId, parseJsonArray(categoryIds), title, description, attachment, parseJsonArray(tags) ?? []);
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
    const { title, description, tags, removeAttachment } = req.body;
    const attachment = req.file;

    const updatedId = await questionService.updateQuestion(
      userId,
      questionId,
      title,
      description,
      attachment,
      parseJsonArray(tags),
      removeAttachment === "true" || removeAttachment === true
    );
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

// delete question by id (soft delete - author or admin)
const deleteQuestion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;

    await questionService.deleteQuestion(userId, questionId, isAdmin);
    return res.status(200).json({ message: "Question deleted successfully", questionId });
  } catch (error) {
    logger.error(`Caught in deleteQuestion controller: ${error.message}`);
    next(error);
  }
};

// mark/unmark a comment as the accepted answer
const setAcceptedAnswer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user?.roles?.includes("admin") ?? false;
    const questionId = req.params.id;
    const { commentId } = req.body;

    const result = await questionService.setAcceptedAnswer(userId, isAdmin, questionId, commentId ?? null);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in setAcceptedAnswer controller: ${error.message}`);
    next(error);
  }
};

// mute/unmute a thread for the signed-in user only - doesn't affect anyone
// else or the thread itself, just stops notifications about it for them
const muteQuestion = async (req, res, next) => {
  try {
    await muteService.muteQuestion(req.user.id, req.params.id);
    return res.status(200).json({ muted: true });
  } catch (error) {
    logger.error(`Caught in muteQuestion controller: ${error.message}`);
    next(error);
  }
};

const unmuteQuestion = async (req, res, next) => {
  try {
    await muteService.unmuteQuestion(req.user.id, req.params.id);
    return res.status(200).json({ muted: false });
  } catch (error) {
    logger.error(`Caught in unmuteQuestion controller: ${error.message}`);
    next(error);
  }
};

// prior saved versions of this question's title/description, most recent first
const getQuestionHistory = async (req, res, next) => {
  try {
    const history = await questionService.getQuestionEditHistory(req.params.id);
    return res.status(200).json(history);
  } catch (error) {
    logger.error(`Caught in getQuestionHistory controller: ${error.message}`);
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
  getSimilarQuestions,
  setAcceptedAnswer,
  muteQuestion,
  unmuteQuestion,
  getQuestionHistory,
};
