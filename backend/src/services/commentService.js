const db = require("../models");
const logger = require("../utils/logger");
const { HttpError } = require("../utils/httpError");
const attachmentService = require("./attachmentService");
const interestService = require("./interestService");
const notificationService = require("./notificationService");

const Comment = db.comment;
const Question = db.question;

// get all comments by question id
const getCommentsByQuestionId = async (questionId, count = 10, offset = 0) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new HttpError(404, "Question not found");
    }

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
          model: Attachment,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
      ],
      attributes: ["id", "content", "created_at"],
    });

    const nextOffset = offset + comments.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(`Fetched comments for question ${questionId}`);
    return [comments, resOffset, totalCount];
  } catch (error) {
    logger.error(`Error fetching comments: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching comments.");
  }
};

// create comment
const createComment = async (user, questionId, content, parentId = null, attachment = null) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new HttpError(404, "Question not found");
    }
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        throw new HttpError(400, "Parent comment not found");
      }
      if (parentComment.question_id !== questionId) {
        throw new HttpError(400, "Parent comment does not belong to the same question");
      }
    }

    const newComment = await Comment.create({
      user_id: user.id,
      question_id: questionId,
      parent_id: parentId,
      content: content,
    });

    // create attachment
    if (attachment) {
      await attachmentService.createAttachment(attachment, { comment_id: newComment.id });
    }

    // create notification
    try {
      if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (parentComment && parentComment.user_id !== user.id) {
          await notificationService.createNotification(
            parentComment.user_id,
            "commented",
            "Someone replied to your comment!",
            `/questions/${questionId}#comment-${newComment.id}`
          );
        }
      } else {
        if (question && question.user_id !== user.id) {
          await notificationService.createNotification(
            question.user_id,
            "commented",
            "Someone commented on your question!",
            `/questions/${questionId}#comment-${newComment.id}`
          );
        }
      }
    } catch (err) {
      logger.error(`Failed to create comment notification: ${err.message}`);
    }
    logger.info(`Comment created successfully with ID: ${newComment.id}`);
    return newComment.id;
  } catch (error) {
    logger.error(`Error creating comment: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error creating comment.");
  }
};

// update comment by id
const updateCommentById = async (user, commentId, content, attachment = null) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }
    if (comment.user_id !== user.id) {
      throw new HttpError(401, "No permission to edit");
    }

    comment.content = content;
    await comment.save();

    // update attachment
    if (attachment) {
      const existingAttachment = await attachmentService.getAttachmentByOwner({ comment_id: commentId });
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
        logger.info(`Deleted existing attachment for comment ${commentId}`);
      }
      await attachmentService.createAttachment(attachment, { comment_id: commentId });
      logger.info(`Created new attachment for comment ${commentId}`);
    }

    // notify interested users
    try {
      const interests = await interestService.getInterestsByCommentId(commentId);
      const userIds = interests
        .map(i => i.user_id)
        .filter(uid => uid !== user.id);
      if (userIds.length > 0) {
        await notificationService.createNotificationsForUsers(
          userIds,
          "update",
          "A comment you bookmarked was updated.",
          `/questions/${comment.question_id}#comment-${commentId}`
        );
        logger.info(`Notified ${userIds.length} users about update to comment ${commentId}`);
      }
    } catch (err) {
      logger.error(`Failed to notify bookmarked users on comment update: ${err.message}`);
    }
    logger.info(`Comment ${commentId} updated successfully`);
    return comment.id;
  } catch (error) {
    logger.error(`Error updating comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Error updating comment");
  }
}

// delete comment by id
const deleteCommentById = async (user, commentId) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }
    if (comment.user_id !== user.id) {
      throw new HttpError(401, "No permission to delete");
    }

    await Comment.destroy({ where: { id: commentId } });
    logger.info(`Comment ${commentId} deleted successfully`);
    return commentId;
  } catch (error) {
    logger.error(`Error deleting comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Error deleting comment");
  }
};


module.exports = {
  getCommentsByQuestionId,
  createComment,
  updateCommentById,
  deleteCommentById,
};
