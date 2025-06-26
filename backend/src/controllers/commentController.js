const commentService = require("../services/commentService");
const attachmentService = require("../services/attachmentService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { IsValidAction } = require("../utils/actionTypes");

// post comment
const createComment = async (req, res) => {
  try {
    logger.debug(`create comment request, body = ${util.inspect(req.body)}`);
    logger.debug(`create comment request, loginUser = ${util.inspect(req.loginUser)}`);

    const { questionId, content, parentId } = req.body;
    const attachment = req.file;
    const loginUser = req.loginUser;

    const parsedQuestionID = parseInt(questionId, 10);
    const parsedParentID = parentId ? parseInt(parentId, 10) : null;

    const commentId = await commentService.createComment(parsedQuestionID, content, loginUser, parsedParentID);

    if (attachment) {
      await attachmentService.createAttachment(attachment, { comment_id: commentId });
    }

    res.status(HttpStatusCodes.CREATED).json({
      message: "Comment created successfully",
      commentId: commentId,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "createComment");
  }
};

// get all comments by question id
const getCommentsByQuestionId = async (req, res) => {
  try {
    logger.debug(`get comment list by question ID request, query params = ${util.inspect(req.query)}`);
    const { questionId, count, offset } = req.query;

    const [comments, newOffset, total] = await commentService.getCommentsByQuestionId(questionId, Number(count), Number(offset));
    return res.status(HttpStatusCodes.OK).json({ message: "success", comments: comments, offset: newOffset, total: total });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getCommentListByQuestionID");
  }
};

// update comment by id
const updateCommentById = async (req, res) => {
  try {
    logger.debug(`update comment request, body = ${util.inspect(req.body)}`);
    logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
    const { commentId, content, deleteAttachment } = req.body;
    const attachment = req.file;
    const loginUser = req.loginUser;

    await commentService.updateCommentById(commentId, content, loginUser);

    const existingAttachment = await attachmentService.getAttachmentByOwner({ comment_id: commentId });

    if (attachment) {
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, { comment_id: commentId });
    } else if (deleteAttachment && existingAttachment) {
      await attachmentService.deleteAttachment(existingAttachment.id);
    }
    
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "updateComment");
  }
};

// delete comment by id
const deleteCommentById = async (req, res) => {
  try {
    logger.debug(`delete comment request, query params = ${util.inspect(req.query)}`);
    logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
    const { commentId } = req.query;
    const loginUser = req.loginUser;

    await commentService.deleteCommentById(commentId, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "deleteCommentById");
  }
};

// take action on comment
const takeActionByCommentId = async (req, res) => {
  try {
    logger.debug(`take action on comment request, body = ${util.inspect(req.body)}`);
    logger.debug(`take action on comment request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { commentId, actionType } = req.body;

    if (!IsValidAction(actionType)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
    }

    await commentService.takeActionByCommentId(commentId, actionType, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "takeAction");
  }
};

// remove action on comment
const removeActionByCommentId = async (req, res) => {
  try {
    logger.debug(`remove action on comment request, body = ${util.inspect(req.body)}`);
    logger.debug(`remove action on comment request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { commentId, actionType } = req.body;

    if (!IsValidAction(actionType)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
    }

    await commentService.removeActionByCommentId(commentId, actionType, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "removeAction");
  }
};

module.exports = {
  createComment,
  getCommentsByQuestionId,
  updateCommentById,
  deleteCommentById,
  takeActionByCommentId,
  removeActionByCommentId,
};
