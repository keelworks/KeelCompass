const logger = require("../utils/logger");

const questionService = require("../services/questionServices");

// get recent questions
const getRecentQuestions = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { count, offset } = req.query;

    const result = await questionService.getRecentQuestions(userId, count, offset);
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

    const result = await questionService.getPopularQuestions(userId, count, offset);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in getPopularQuestions controller: ${error.message}`);
    next(error);
  }
};

// get pending questions (facilitator)
const getPendingQuestions = async (req, res, next) => {
// query: count, offset
// response: { questions, total, offset }
// CODE HERE
}
  
// get question by id
const getQuestionById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await questionService.getQuestion(userId, id);
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
    const { categoryIds, title, description } = req.body;
    const attachment = req.file;

    const questionId = await questionService.createQuestion(userId, categoryIds, title, description, attachment);
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
    const { title, description } = req.body;
    const attachment = req.file;

    const updatedId = await questionService.updateQuestion(userId, questionId, title, description, attachment);
    return res.status(200).json(updatedId);
  } catch (error) {
    logger.error(`Caught in updateQuestion controller: ${error.message}`);
    next(error);
  }
};

// update question status (facilitator)
const updateQuestionStatus = async (req, res, next) => {
// params: id
// body: status
// response: questionId
// CODE HERE
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
};
