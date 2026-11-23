const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Comment = db.Comment;
const UserCommentAction = db.UserCommentAction;
const notificationService = require("./notificationServices");
const { snippet } = require("../utils/textUtils");

// create comment action
const createCommentAction = async (userId, commentId, actionType) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new HttpError(404, "Comment not found");
    if (comment.deleted_at) throw new HttpError(400, "This comment has been deleted");
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
        const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
        const actorName = actor?.display_name || actor?.username || "Someone";
        message = `${actorName} liked your comment: "${snippet(comment.content, 60)}"`;
        await User.increment("reputation_points", { by: 1, where: { id: comment.user_id } });
      } else if (actionType === "report") {
        notifType = "reported";
        // deliberately anonymous, same reasoning as question reports
        message = "Your comment was reported.";
      } else {
        return;
      }
      await notificationService.createNotification(
        comment.user_id,
        notifType,
        message,
        `/questions/${comment.question_id}#comment-${comment.id}`,
        { sourceType: `comment_${actionType}`, sourceId: comment.id, actorUserId: userId, questionId: comment.question_id }
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

    if (actionType === "like") {
      const comment = await Comment.findByPk(commentId);
      if (comment && comment.user_id !== userId) {
        await User.increment("reputation_points", { by: -1, where: { id: comment.user_id } });
      }
    }

    // undoing the action removes the notification it caused, same as on questions
    await notificationService.deleteNotificationsBySource(`comment_${actionType}`, commentId, userId);

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
