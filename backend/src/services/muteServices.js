const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const MutedQuestion = db.MutedQuestion;

const isQuestionMuted = async (userId, questionId) => {
  if (!userId || !questionId) return false;
  const row = await MutedQuestion.findOne({ where: { user_id: userId, question_id: questionId } });
  return !!row;
};

// bulk form used when filtering a list of notification recipients - one
// query instead of one per candidate
const filterOutMutedUserIds = async (userIds, questionId) => {
  if (!questionId || !userIds || userIds.length === 0) return userIds || [];
  const muted = await MutedQuestion.findAll({
    where: { question_id: questionId, user_id: userIds },
    attributes: ["user_id"],
  });
  const mutedSet = new Set(muted.map((m) => m.user_id));
  return userIds.filter((id) => !mutedSet.has(id));
};

const muteQuestion = async (userId, questionId) => {
  try {
    await MutedQuestion.findOrCreate({ where: { user_id: userId, question_id: questionId } });
    logger.info(`User ${userId} muted question ${questionId}`);
  } catch (error) {
    logEverything(error, "muteServices");
    throw new HttpError(500, "Error muting thread");
  }
};

const unmuteQuestion = async (userId, questionId) => {
  try {
    await MutedQuestion.destroy({ where: { user_id: userId, question_id: questionId } });
    logger.info(`User ${userId} unmuted question ${questionId}`);
  } catch (error) {
    logEverything(error, "muteServices");
    throw new HttpError(500, "Error unmuting thread");
  }
};

module.exports = { isQuestionMuted, filterOutMutedUserIds, muteQuestion, unmuteQuestion };
