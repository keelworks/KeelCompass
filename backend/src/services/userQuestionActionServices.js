const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const notificationService = require("./notificationServices");
const { snippet } = require("../utils/textUtils");

// create question action
const createQuestionAction = async (userId, questionId, actionType) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
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
      let notifType, message;
      if (actionType === "like") {
        notifType = "liked";
        const actor = await User.findByPk(userId, { attributes: ["display_name", "username"] });
        const actorName = actor?.display_name || actor?.username || "Someone";
        message = `${actorName} liked your question: "${snippet(question.title, 60)}"`;
        await User.increment("reputation_points", { by: 1, where: { id: question.user_id } });
      } else if (actionType === "report") {
        notifType = "reported";
        // deliberately anonymous - no actor name, so reporting doesn't risk
        // identifying the reporter to the person who got reported
        message = "Your question was reported.";
      } else {
        return questionId;
      }
      await notificationService.createNotification(
        question.user_id,
        notifType,
        message,
        `/questions/${question.id}`,
        { sourceType: `question_${actionType}`, sourceId: question.id, actorUserId: userId, questionId: question.id }
      );
      logger.info(`Notification sent to user ${question.user_id} for ${notifType} on question ${question.id}`);
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

    if (actionType === "like") {
      const question = await Question.findByPk(questionId);
      if (question && question.user_id !== userId) {
        await User.increment("reputation_points", { by: -1, where: { id: question.user_id } });
      }
    }

    // undoing the action removes the notification it caused, so the
    // recipient doesn't accumulate stale entries from likes/reports that
    // were later reversed
    await notificationService.deleteNotificationsBySource(`question_${actionType}`, questionId, userId);

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
