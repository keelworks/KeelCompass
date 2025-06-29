const logger = require("../utils/logger");

const userQuestionActionService = require("../services/userQuestionActionServices");

// create question action
const createQuestionAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, actionType } = req.body;

    await userQuestionActionService.createQuestionAction(userId, questionId, actionType);
    return res.status(201).json({ message: "Question action created successfully", questionId: questionId, actionType: actionType });
  } catch (error) {
    logger.error(`Caught in createQuestionAction controller: ${error.message}`);
    next(error); 
  }
};

// delete question action
const deleteQuestionAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, actionType } = req.body;

    await userQuestionActionService.deleteQuestionAction(userId, questionId, actionType);
    return res.status(200).json({ message: "Question action deleted successfully", questionId: questionId, actionType: actionType });
  } catch (error) {
    logger.error(`Caught in deleteQuestionAction controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createQuestionAction,
  deleteQuestionAction,
};
