const logger = require("../utils/logger");

const userCommentActionService = require("../services/userCommentActionServices");

// create comment action
const createCommentAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { commentId, actionType } = req.body;

    const createdId = await userCommentActionService.createCommentAction(userId, commentId, actionType);
    return res.status(201).json(createdId);
  } catch (error) {
    logger.error(`Caught in createCommentAction controller: ${error.message}`);
    next(error); 
  }
};

// delete action on comment
const deleteCommentAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { commentId, actionType } = req.body;

    const deletedId = await userCommentActionService.deleteCommentAction(userId, commentId, actionType);
    return res.status(200).json(deletedId);
  } catch (error) {
    logger.error(`Caught in deleteCommentAction controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createCommentAction,
  deleteCommentAction,
};
