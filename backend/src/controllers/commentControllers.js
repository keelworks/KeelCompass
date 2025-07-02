const logger = require("../utils/logger");

const commentService = require("../services/commentServices");

// create comment
const createComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, content, parentId } = req.body;
    const attachment = req.file;

    const parsedParentId = parentId ? parentId : null;
    const commentId = await commentService.createComment(userId, questionId, content, parsedParentId, attachment);
    res.status(201).json(commentId);
  } catch (error) {
    logger.error(`Caught in createComment controller: ${error.message}`);
    next(error);
  }
};

// update comment by id
const updateComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;
    const { content } = req.body;
    const attachment = req.file;

    const updatedId = await commentService.updateCommentById(userId, commentId, content, attachment);
    return res.status(200).json(updatedId);
  } catch (error) {
    logger.error(`Caught in updateCommentById controller: ${error.message}`);
    next(error);
  }
};

// delete comment by id
const deleteComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    const deletedId = await commentService.deleteCommentById(userId, commentId);
    return res.status(200).json(deletedId);
  } catch (error) {
    logger.error(`Caught in deleteCommentById controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
