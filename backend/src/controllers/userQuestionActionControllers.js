const logger = require("../utils/logger");

const userQuestionActionService = require("../services/userQuestionActionServices");

// create question action
const createQuestionAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, actionType } = req.body;

    const createdId = await userQuestionActionService.createQuestionAction(userId, questionId, actionType);
    return res.status(201).json(createdId);
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

    const deletedId = await userQuestionActionService.deleteQuestionAction(userId, questionId, actionType);
    return res.status(200).json(deletedId);
  } catch (error) {
    logger.error(`Caught in deleteQuestionAction controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createQuestionAction,
  deleteQuestionAction,
};
