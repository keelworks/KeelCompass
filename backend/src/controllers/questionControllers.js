const logger = require("../utils/logger");

const questionService = require("../services/questionServices");

// get recent questions
const getRecentQuestions = async (req, res, next) => {
  try {
    const { count, offset } = req.query;

    const [questions, totalCount, resOffset] = await questionService.getRecentQuestions(count, offset);
    return res.status(200).json({ message: "Fetched recent questions successfully", questions: questions, total: totalCount, offset: resOffset });
  } catch (error) {
    logger.error(`Caught in getRecentQuestions controller: ${error.message}`);
    next(error);
  }
};

// get popular questions
const getPopularQuestions = async (req, res, next) => {
  try {
    const { count, offset } = req.query;

    const [questions, totalCount, resOffset] = await questionService.getPopularQuestions(count, offset);
    return res.status(200).json({ message: "Fetched popular questions successfully", questions: questions, total: totalCount, offset: resOffset });
  } catch (error) {
    logger.error(`Caught in getPopularQuestions controller: ${error.message}`);
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
    return res.status(201).json({ message: "Question created successfully", questionId: questionId });
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

    await questionService.updateQuestion(userId, questionId, title, description, attachment);
    return res.status(200).json({ message: "Question updated successfully", questionId });
  } catch (error) {
    logger.error(`Caught in updateQuestion controller: ${error.message}`);
    next(error);
  }
};

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
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
