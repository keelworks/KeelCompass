const logger = require("../utils/logger");

const userCommentActionService = require("../services/userCommentActionServices");

// create comment action
const createCommentAction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { commentId, actionType } = req.body;

    await userCommentActionService.createCommentAction(userId, commentId, actionType);
    return res.status(201).json({ message: "Comment action created successfully", commentId: commentId, actionType: actionType });
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

    await userCommentActionService.deleteCommentAction(userId, commentId, actionType);
    return res.status(200).json({ message: "Comment action deleted successfully", commentId: commentId, actionType: actionType });
  } catch (error) {
    logger.error(`Caught in deleteCommentAction controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createCommentAction,
  deleteCommentAction,
};
