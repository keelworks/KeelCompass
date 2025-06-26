const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const User = db.users;
const Question = db.questions;
const Comment = db.comments;
const UserCommentAction = db.userCommentActions;

// post comment
const createComment = async (questionId, content, loginUser, parentId = null) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
    }

    if (parentId !== null) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        throw new HttpError(HttpStatusCodes.BAD_REQUEST, "parent comment not found");
      }
      if (parentComment.question_id !== questionId) {
        throw new HttpError(HttpStatusCodes.BAD_REQUEST, "parent comment does not belong to the same question");
      }
    }

    logger.info(`Creating comment for question ${questionId} by user ${loginUser.id}`);
    const newComment = await Comment.create({
      content: content,
      question_id: questionId,
      user_id: loginUser.id,
      parent_id: parentId,

    });

    return newComment.id;
  } catch (error) {
    logger.error(`Error creating comment: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error creating comment.");
  }
};

// get all comments by question id
const getCommentsByQuestionId = async (questionId, count, offset) => {
  try {
    logger.info(`Fetching comments for question ${questionId}`);
    const { count: totalCount, rows: comments } = await Comment.findAndCountAll({
      order: [["created_at"]],
      where: {
        question_id: questionId,
      },
      limit: count,
      offset: offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: db.attachments,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
      ],
      attributes: ["id", "content", "created_at"],
    });

    const nextOffset = offset + comments.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;

    return [comments, resOffset, totalCount];
  } catch (error) {
    logger.error(`Error fetching comments: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching comments.");
  }
};

// update comment by id
const updateCommentById = async (commentId, content, loginUser) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      logger.warn(`Warning updating comment: comment not found. ID = ${commentId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
    }

    if (comment.user_id != loginUser.id) {
      logger.warn("Warning updating comment: no permission to edit");
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }

    logger.info(`Updating comment ${commentId}`);
    comment.content = content;


    await comment.save();
  } catch (error) {
    logger.error(`Error updating comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error updating comment.");
  }
};

// delete comment by id
const deleteCommentById = async (commentId, loginUser) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      logger.warn(`Warning deleting comment: comment not found. ID = ${commentId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
    }

    if (comment.user_id != loginUser.id) {
      logger.warn("Warning deleting comment: no permission to delete");
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }

    logger.info(`Deleting comment ${commentId}`);
    await Comment.destroy({ where: { id: commentId } });
  } catch (error) {
    logger.error(`Error deleting comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error deleting comment.");
  }
};

// take action on comment
const takeActionByCommentId = async (commentId, actionType, loginUser) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      logger.warn(`Warning adding actions: comment not found. ID = ${commentId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
    }

    logger.info(`User ${loginUser.id} taking action ${actionType} on comment ${commentId}`);
    const [_, created] = await UserCommentAction.findOrCreate({
      where: {
        user_id: loginUser.id,
        comment_id: commentId,
        action_type: actionType,
      },
    });

    if (!created) {
      logger.warn("Warning adding actions: action existed");
      throw new HttpError(HttpStatusCodes.CONFLICT, "User has already submitted this comment action");
    }
  } catch (error) {
    logger.error(`Error taking action on comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error taking action on comment.");
  }
};

// remove action on comment
const removeActionByCommentId = async (commentId, actionType, loginUser) => {
  try {
    logger.info(`User ${loginUser.id} removing action ${actionType} on comment ${commentId}`);
    const action = await UserCommentAction.findOne({
      where: {
        user_id: loginUser.id,
        comment_id: commentId,
        action_type: actionType,
      },
    });

    if (!action) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "record not found");
    }

    await action.destroy();
  } catch (error) {
    logger.error(`Error removing action on comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error removing action on comment.");
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
