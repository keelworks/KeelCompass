const logger = require("../utils/logger");

const commentService = require("../services/commentServices");

// get all comments by question id
const getCommentsByQuestionId = async (req, res, next) => {
  try {
    const { questionId, count, offset } = req.query;

    const [comments, totalCount, newOffset] = await commentService.getCommentsByQuestionId(questionId, count, offset);
    return res.status(200).json({ message: "Fetched comments successfully", comments: comments, total: totalCount, offset: newOffset });
  } catch (error) {
    logger.error(`Caught in getCommentsByQuestionId controller: ${error.message}`);
    next(error);  }
};

// create comment
const createComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, content, parentId } = req.body;
    const attachment = req.file;

    const parsedParentId = parentId ? parentId : null;
    const commentId = await commentService.createComment(userId, questionId, content, parsedParentId, attachment);
    res.status(201).json({ message: "Comment created successfully", commentId: commentId });
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

    await commentService.updateCommentById(userId, commentId, content, attachment);
    return res.status(200).json({ message: "Comment updated successfully", commentId });
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

    await commentService.deleteCommentById(userId, commentId);
    return res.status(200).json({ message: "Comment deleted successfully", commentId });
  } catch (error) {
    logger.error(`Caught in deleteCommentById controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getCommentsByQuestionId,
  createComment,
  updateComment,
  deleteComment,
};
