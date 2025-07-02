const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Comment = db.Comment;
const UserCommentAction = db.UserCommentAction;
const notificationService = require("./notificationServices");

// create comment action
const createCommentAction = async (userId, commentId, actionType) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new HttpError(404, "Comment not found");
    const result = await UserCommentAction.findOrCreate({
      where: {
        user_id: userId,
        comment_id: commentId,
        action_type: actionType,
      },
    });
    const created = result[1];
    if (!created) throw new HttpError(409, "User has already submitted this comment action");

    if (comment.user_id !== userId) {
      let notifType, message;
      if (actionType === "like") {
        notifType = "liked";
        message = "Your comment was liked!";
      } else if (actionType === "report") {
        notifType = "reported";
        message = "Your comment was reported.";
      } else {
        return;
      }
      await notificationService.createNotification(
        comment.user_id,
        notifType,
        message,
        `/questions/${comment.question_id}#comment-${comment.id}`
      );
      logger.info(`Notification sent to user ${comment.user_id} for ${notifType} on comment ${comment.id}`);
    }
    return commentId;
  } catch (error) {
    logEverything(error, "userCommentActionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error taking action on comment");
  }
};

// delete comment action
const deleteCommentAction = async (userId, commentId, actionType) => {
  try {
    const action = await UserCommentAction.findOne({
      where: {
        user_id: userId,
        comment_id: commentId,
        action_type: actionType,
      },
    });
    if (!action) throw new HttpError(404, "User has not taken action on this comment");

    await action.destroy();
    logger.info(`Comment action removed successfully for user ${userId} on comment ${commentId}`);
    return commentId;
  } catch (error) {
    logEverything(error, "userCommentActionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error removing action on comment");
  }
};

module.exports = {
  createCommentAction,
  deleteCommentAction,
};
