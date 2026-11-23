const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const notificationService = require("./notificationServices");
const { snippet } = require("../utils/textUtils");
const { REACTION_TYPES, REACTION_META } = require("../constants/reactionTypes");
const { switchReaction } = require("../utils/reactionUtils");

// create question action
const createQuestionAction = async (userId, questionId, actionType) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");

    if (REACTION_TYPES.includes(actionType)) {
      const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
      const actorName = actor?.display_name || actor?.username || "Someone";
      const meta = REACTION_META[actionType];

      await switchReaction({
        Model: UserQuestionAction,
        whereBase: { user_id: userId, question_id: questionId },
        actionType,
        authorId: question.user_id,
        actingUserId: userId,
        sourceType: "question_reaction",
        targetId: questionId,
        User,
        notificationService,
        buildNotification: () =>
          notificationService.createNotification(
            question.user_id,
            "liked",
            `${actorName} reacted ${meta.emoji} ${meta.label} to your question: "${snippet(question.title, 60)}"`,
            `/questions/${question.id}`,
            { sourceType: "question_reaction", sourceId: question.id, actorUserId: userId, questionId: question.id }
          ),
      });
      logger.info(`Question action (${actionType}) recorded for user ${userId} on question ${questionId}`);
      return questionId;
    }

    // report: independent of reactions, unchanged semantics
    const result = await UserQuestionAction.findOrCreate({
      where: {
        user_id: userId,
        question_id: questionId,
        action_type: actionType,
      },
    });
    const created = result[1];
    if (!created) throw new HttpError(409, "User has already submitted this question action");

    if (question.user_id !== userId) {
      // deliberately anonymous - no actor name, so reporting doesn't risk
      // identifying the reporter to the person who got reported
      await notificationService.createNotification(
        question.user_id,
        "reported",
        "Your question was reported.",
        `/questions/${question.id}`,
        { sourceType: "question_report", sourceId: question.id, actorUserId: userId, questionId: question.id }
      );
      logger.info(`Notification sent to user ${question.user_id} for reported on question ${question.id}`);
    }
    return questionId;
  } catch (error) {
    logEverything(error, "userQuestionActionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error taking action on question");
  }
};

// delete question action
const deleteQuestionAction = async (userId, questionId, actionType) => {
  try {
    const action = await UserQuestionAction.findOne({
      where: {
        user_id: userId,
        question_id: questionId,
        action_type: actionType,
      },
    });
    if (!action) throw new HttpError(404, "User has not taken action on this question");

    await action.destroy();

    if (REACTION_TYPES.includes(actionType)) {
      const question = await Question.findByPk(questionId);
      if (question && question.user_id !== userId) {
        await User.increment("reputation_points", { by: -1, where: { id: question.user_id } });
      }
    }

    // undoing the action removes the notification it caused, so the
    // recipient doesn't accumulate stale entries from reactions/reports that
    // were later reversed
    const sourceType = REACTION_TYPES.includes(actionType) ? "question_reaction" : `question_${actionType}`;
    await notificationService.deleteNotificationsBySource(sourceType, questionId, userId);

    logger.info(`Question action removed successfully for user ${userId} on question ${questionId}`);
    return questionId;
  } catch (error) {
    logEverything(error, "userQuestionActionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error removing action on question");
  }
};

module.exports = {
  createQuestionAction,
  deleteQuestionAction,
};
