const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Comment = db.Comment;
const UserCommentAction = db.UserCommentAction;
const notificationService = require("./notificationServices");
const { snippet } = require("../utils/textUtils");
const { REACTION_TYPES, REACTION_META } = require("../constants/reactionTypes");
const { switchReaction } = require("../utils/reactionUtils");

// create comment action
const createCommentAction = async (userId, commentId, actionType) => {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new HttpError(404, "Comment not found");
    if (comment.deleted_at) throw new HttpError(400, "This comment has been deleted");

    if (REACTION_TYPES.includes(actionType)) {
      const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
      const actorName = actor?.display_name || actor?.username || "Someone";
      const meta = REACTION_META[actionType];

      await switchReaction({
        Model: UserCommentAction,
        whereBase: { user_id: userId, comment_id: commentId },
        actionType,
        authorId: comment.user_id,
        actingUserId: userId,
        sourceType: "comment_reaction",
        targetId: commentId,
        User,
        notificationService,
        buildNotification: () =>
          notificationService.createNotification(
            comment.user_id,
            "liked",
            `${actorName} reacted ${meta.emoji} ${meta.label} to your comment: "${snippet(comment.content, 60)}"`,
            `/questions/${comment.question_id}#comment-${comment.id}`,
            { sourceType: "comment_reaction", sourceId: comment.id, actorUserId: userId, questionId: comment.question_id }
          ),
      });
      logger.info(`Comment action (${actionType}) recorded for user ${userId} on comment ${commentId}`);
      return commentId;
    }

    // report: independent of reactions, unchanged semantics
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
      // deliberately anonymous, same reasoning as question reports
      await notificationService.createNotification(
        comment.user_id,
        "reported",
        "Your comment was reported.",
        `/questions/${comment.question_id}#comment-${comment.id}`,
        { sourceType: "comment_report", sourceId: comment.id, actorUserId: userId, questionId: comment.question_id }
      );
      logger.info(`Notification sent to user ${comment.user_id} for reported on comment ${comment.id}`);
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

    if (REACTION_TYPES.includes(actionType)) {
      const comment = await Comment.findByPk(commentId);
      if (comment && comment.user_id !== userId) {
        await User.increment("reputation_points", { by: -1, where: { id: comment.user_id } });
      }
    }

    // undoing the action removes the notification it caused, same as on questions
    const sourceType = REACTION_TYPES.includes(actionType) ? "comment_reaction" : `comment_${actionType}`;
    await notificationService.deleteNotificationsBySource(sourceType, commentId, userId);

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
