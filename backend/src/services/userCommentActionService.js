const db = require("../models");
const logger = require("../utils/logger");
const { HttpError } = require("../utils/httpError");
const notificationService = require("./notificationService");

const UserCommentAction = db.userCommentAction;
const Comment = db.comment;

// helper to send notification for comment actions
async function notifyCommentAction(user, comment, actionType) {
  if (comment.user_id !== user.id) {
    try {
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
    } catch (err) {
      logger.error(`Failed to create comment ${actionType} notification: ${err.message}`);
    }
  }
}

// take action on comment
const takeActionByCommentId = async (user, commentId, actionType) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new HttpError(404, "Comment not found");
    }
    const result = await UserCommentAction.findOrCreate({
      where: {
        user_id: user.id,
        comment_id: commentId,
        action_type: actionType,
      },
    });
    const created = result[1];
    if (!created) {
      throw new HttpError(409, "User has already submitted this comment action");
    }

    await notifyCommentAction(user, comment, actionType);
    return;
  } catch (error) {
    logger.error(`Error taking action on comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Error taking action on comment");
  }
};

// remove action on comment
const removeActionByCommentId = async (user, commentId, actionType) => {
  try {
    const action = await UserCommentAction.findOne({
      where: {
        user_id: user.id,
        comment_id: commentId,
        action_type: actionType,
      },
    });
    if (!action) {
      throw new HttpError(404, "Action record not found");
    }

    await action.destroy();
  } catch (error) {
    logger.error(`Error removing action on comment ${commentId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Error removing action on comment");
  }
};

module.exports = {
  takeActionByCommentId,
  removeActionByCommentId,
};
