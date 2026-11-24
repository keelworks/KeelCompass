const logger = require("../utils/logger");

const commentService = require("../services/commentServices");

// mentionedUserIds/mentionedGroupTags arrive as a real array over JSON (the
// reply path) or a JSON-encoded string over multipart/form-data (the
// top-level comment box)
const parseMentionedList = (raw) => {
  if (raw === undefined) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// create comment
const createComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, content, parentId, mentionedUserIds, mentionedGroupTags } = req.body;
    const attachment = req.file;

    const parsedParentId = parentId ? parentId : null;
    const commentId = await commentService.createComment(
      userId,
      questionId,
      content,
      parsedParentId,
      attachment,
      parseMentionedList(mentionedUserIds),
      parseMentionedList(mentionedGroupTags)
    );
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
    const isAdmin = req.user?.roles?.includes("admin") ?? false;

    const deletedId = await commentService.deleteCommentById(userId, commentId, isAdmin);
    return res.status(200).json(deletedId);
  } catch (error) {
    logger.error(`Caught in deleteCommentById controller: ${error.message}`);
    next(error);
  }
};

// prior saved versions of a comment's content, most recent first
const getCommentHistory = async (req, res, next) => {
  try {
    const history = await commentService.getCommentEditHistory(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    logger.error(`Caught in getCommentHistory controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentHistory,
};
