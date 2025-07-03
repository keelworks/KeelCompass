const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Interest = db.Interest;
const Question = db.Question;
const Comment = db.Comment;
const notificationService = require("./notificationServices");

// get interests by user id
const getUserInterests = async (userId) => {
  try {
    const interests = await Interest.findAll({
      where: { user_id: userId },
      include: [
        { model: Question, as: "question", attributes: ["id", "title", "description"] },
        { model: Comment, as: "comment", attributes: ["id", "content"] },
      ],
    });
    logger.info(`Fetched interests for user ${userId}`);
    return interests;
  } catch (error) {
    logEverything(error, "interestServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching interests");
  }
};

// get interests by comment id
const getInterestsByCommentId = async (commentId) => {
  try {
    return await Interest.findAll({
      where: { comment_id: commentId },
      attributes: ["user_id"],
      raw: true,
    });
  } catch (error) {
    logEverything(error, "interestServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching interests");
  }
};

// create interest
const createInterest = async (userId, questionId, commentId) => {
  try {
    let target, where = { user_id: userId }, interestData;
    if (questionId) {
      target = await Question.findByPk(questionId);
      if (!target) throw new HttpError(404, "Question not found");
      where.question_id = questionId;
      interestData = { user_id: userId, question_id: questionId };
    } else {
      target = await Comment.findByPk(commentId);
      if (!target) throw new HttpError(404, "Comment not found");
      where.comment_id = commentId;
      interestData = { user_id: userId, comment_id: commentId };
    }
    const existingInterest = await Interest.findOne({ where });
    if (existingInterest) throw new HttpError(409, "Interest already exists");

    const newInterest = await Interest.create(interestData);
    if (target.user_id !== userId) {
      try {
        let message, link;
        if (questionId) {
          message = "Your question was bookmarked!";
          link = `/questions/${questionId}`;
        } else {
          message = "Your comment was bookmarked!";
          link = `/questions/${target.question_id}#comment-${commentId}`;
        }

        // create notification for post user
        await notificationService.createNotification(target.user_id, "bookmarked", message, link);

        logger.info(`Notification sent to user ${target.user_id} for ${questionId ? "question" : "comment"} bookmark`);
      } catch (err) {
        logger.error(`Failed to create ${questionId ? "question" : "comment"} bookmark notification: ${err.message}`);
      }
    }
    logger.info(`User ${userId} bookmarked ${questionId ? "question" : "comment"} ${questionId || commentId}`);
    return newInterest.id;
  } catch (error) {
    logEverything(error, "interestServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error creating interest");
  }
};

// delete interest
const deleteInterest = async (userId, id) => {
  try {
    const interest = await Interest.findByPk(id);
    if (!interest) throw new HttpError(404, "Interest not found");
    if (interest.user_id != userId) throw new HttpError(401, "No permission to delete interest");

    await interest.destroy();
    logger.info(`Interest ${id} deleted successfully`);
    return id;
  } catch (error) {
    logEverything(error, "interestServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting interest");
  }
};

module.exports = {
  getUserInterests,
  getInterestsByCommentId,
  createInterest,
  deleteInterest,
};
