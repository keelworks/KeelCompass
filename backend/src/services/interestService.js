const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const Interest = db.interests;
const User = db.users;
const Question = db.questions;
const Comment = db.comments;

// post interest
const saveInterest = async (loginUser, questionId, commentId) => {
  try {
    logger.info(`User ${loginUser.id} saving interest for question ${questionId} or comment ${commentId}`);
    const user = await User.findByPk(loginUser.id);
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }

    if (!questionId && !commentId) {
      throw new HttpError(HttpStatusCodes.BAD_REQUEST, "Either questionId or commentId must be provided");
    }

    const interestData = { user_id: loginUser.id };
    const where = { user_id: loginUser.id };

    if (questionId) {
      interestData.question_id = questionId;
      where.question_id = questionId;
      const question = await Question.findByPk(questionId);
      if (!question) {
        throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
      }
    } else {
      interestData.comment_id = commentId;
      where.comment_id = commentId;
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
      }
    }

    const existingInterest = await Interest.findOne({ where });
    if (existingInterest) {
      throw new HttpError(HttpStatusCodes.CONFLICT, "interest already exists");
    }
    const newInterest = await Interest.create({ user_id: loginUser.id, question_id: questionId });
    // Notification for question bookmark
    if (question.user_id !== loginUser.id) {
      try {
        const notificationService = require("./notificationService");
        await notificationService.createNotification(
          question.user_id,
          "bookmarked",
          "Your question was bookmarked!",
          `/questions/${questionId}`
        );
      } catch (err) {
        console.error(`Failed to create question bookmark notification: ${err.message}`);
      }
    }
    return newInterest.id;
  } catch (error) {
    logger.error(`Error saving interest for user ${loginUser.id}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error saving interest.");
  }
};

// get interests by user id
const getUserInterests = async (loginUser) => {
  try {
    logger.info(`Fetching interests for user ${loginUser.id}`);
    const user = await User.findByPk(loginUser.id);
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }
    const interests = await Interest.findAll({
      where: { user_id: loginUser.id },
      include: [
        {
          model: Question,
          as: "question",
          attributes: ["id", "title", "description"],
        },
        {
          model: Comment,
          as: "comment",
          attributes: ["id", "content"],
        },
      ],
    });
    // Notification for comment bookmark
    if (comment.user_id !== loginUser.id) {
      try {
        const notificationService = require("./notificationService");
        await notificationService.createNotification(
          comment.user_id,
          "bookmarked",
          "Your comment was bookmarked!",
          `/questions/${comment.question_id}#comment-${commentId}`
        );
      } catch (err) {
        console.error(`Failed to create comment bookmark notification: ${err.message}`);
      }
    }
    return interests;
  } catch (error) {
    logger.error(`Error fetching interests for user ${loginUser.id}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching interests.");
  }
};

// delete interest
const deleteInterest = async (loginUser, interestId) => {
  try {
    logger.info(`User ${loginUser.id} deleting interest ${interestId}`);
    const interest = await Interest.findByPk(interestId);
    if (!interest) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "interest not found");
    }
    if (interest.user_id != loginUser.id) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }
    await interest.destroy();
  } catch (error) {
    logger.error(`Error deleting interest ${interestId} for user ${loginUser.id}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error deleting interest.");
  }
};

module.exports = {
  saveInterest,
  getUserInterests,
  deleteInterest
};
