const db = require("../models");
const ActionTypes = require("../constants/actionTypes");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const Sequelize = db.sequelize;
const User = db.users;
const Question = db.questions;
const UserQuestionAction = db.userQuestionActions;

// post question
const createQuestion = async (title, description, categoryIds, loginUser) => {
  const t = await Sequelize.transaction();
  try {
    logger.info(`User ${loginUser.id} creating question with categories: ${categoryIds}`);
    const user = await User.findByPk(loginUser.id);
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }

    const newQuestion = await Question.create(
      {
        title,
        description,
        user_id: user.id,
      },
      { transaction: t }
    );

    if (categoryIds && categoryIds.length > 0) {
      await newQuestion.setCategories(categoryIds, { transaction: t });
    }

    await t.commit();
    return newQuestion.id;
  } catch (error) {
    await t.rollback();
    logger.error(`Error creating question: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error creating question.");
  }
};

// get recent questions
const getRecentQuestions = async (count, offset) => {
  try {
    logger.info(`Fetching recent questions with count ${count} and offset ${offset}`);
    const { count: totalCount, rows: questions } = await Question.findAndCountAll({
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}')`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.REPORT}')`), 'reportCount'],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: db.attachments,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: count,
      offset: offset,
    });

    const nextOffset = offset + questions.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;

    return [questions, resOffset, totalCount];
  } catch (error) {
    logger.error(`Error fetching recent questions: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching recent questions.");
  }
};

// get popular questions
const getPopularQuestions = async (count, offset) => {
  try {
    logger.info(`Fetching popular questions with count ${count} and offset ${offset}`);
    const popularityScore = Sequelize.literal(`(
      (SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}') +
      (SELECT COUNT(*) FROM Comments WHERE Comments.question_id = Question.id)
    )`);

    const { count: totalCount, rows: questions } = await Question.findAndCountAll({
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}')`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.question_id = Question.id)`), 'commentCount'],
          [popularityScore, 'popularityScore'],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: db.attachments,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
      ],
      order: [[popularityScore, "DESC"]],
      limit: count,
      offset: offset,
    });

    const nextOffset = offset + questions.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;

    return [questions, resOffset, totalCount];
  } catch (error) {
    logger.error(`Error fetching popular questions: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching popular questions.");
  }
};

// get question by id
const getQuestionById = async (questionId) => {
  try {
    logger.info(`Fetching question with ID ${questionId}`);
    const question = await Question.findOne({
      where: { id: questionId },
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}')`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.REPORT}')`), 'reportCount'],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: db.attachments,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
      ],
    });

    if (!question) {
      logger.warn(`Warning get question by ID: question not found. ID = ${questionId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
    }

    return question;
  } catch (error) {
    logger.error(`Error fetching question ${questionId}: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error fetching question.");
  }
};

// update question by id
const updateQuestionById = async (questionId, title, description, loginUser) => {
  try {
    logger.info(`User ${loginUser.id} updating question ${questionId}`);
    const question = await Question.findByPk(questionId);
    if (!question) {
      logger.warn(`Warning updating question: question not found. ID = ${questionId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
    }

    if (question.user_id != loginUser.id) {
      logger.warn("Warning updating question: no permission to update");
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }

    if (title) question.title = title;
    if (description) question.description = description;

    await question.save();

    // Notify all users who bookmarked/interested this question (except the updater)
    try {
      const Interest = require("../models").interests;
      const notificationService = require("./notificationService");
      const interests = await Interest.findAll({
        where: { question_id: questionId },
        attributes: ["user_id"],
        raw: true,
      });
      const userIds = interests
        .map(i => i.user_id)
        .filter(uid => uid !== loginUser.id);
      if (userIds.length > 0) {
        await notificationService.createNotificationsForUsers(
          userIds,
          "update",
          "A question you bookmarked was updated.",
          `/questions/${questionId}`
        );
      }
    } catch (err) {
      logger.error(`Failed to notify bookmarked users on question update: ${err.message}`);
    }
  } catch (error) {
    logger.error(`Error updating question ${questionId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error updating question.");
  }
};

// delete question by id
const deleteQuestionById = async (questionId, loginUser) => {
  try {
    logger.info(`User ${loginUser.id} deleting question ${questionId}`);
    const question = await Question.findByPk(questionId);
    if (!question) {
      logger.warn(`Warning deleting question: question not found. ID = ${questionId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
    }

    if (question.user_id != loginUser.id) {
      logger.warn("Warning deleting question: no permission to delete");
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }

    await Question.destroy({ where: { id: questionId } });
  } catch (error) {
    logger.error(`Error deleting question ${questionId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error deleting question.");
  }
};

// take action on question
const takeActionByQuestionId = async (questionId, actionType, loginUser) => {
  try {
    logger.info(`User ${loginUser.id} taking action ${actionType} on question ${questionId}`);
    const question = await Question.findByPk(questionId);
    if (!question) {
      logger.warn(`Warning adding actions: question not found. ID = ${questionId}`);
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
    }

    const [action, created] = await UserQuestionAction.findOrCreate({
      where: {
        user_id: loginUser.id,
        question_id: questionId,
        action_type: actionType,
      },
    });

    if (!created) {
      logger.warn("Warning adding actions: action existed");
      throw new HttpError(HttpStatusCodes.CONFLICT, "record existed");
    }

    // Notification for like action (only if actionType is 'like')
    if (actionType === ActionTypes.LIKE) {
      if (question.user_id !== loginUser.id) {
        // Notify the question owner, but not if user likes their own question
        try {
          const notificationService = require("./notificationService");
          await notificationService.createNotification(
            question.user_id,
            "liked",
            "Your question was liked!",
            `/questions/${questionId}`
          );
        } catch (err) {
          logger.error(`Failed to create question like notification: ${err.message}`);
        }
      }
    }

    // Notification for report action (only if actionType is 'report')
    if (actionType === ActionTypes.REPORT) {
      if (question.user_id !== loginUser.id) {
        // Notify the question owner, but not if user reports their own question
        try {
          const notificationService = require("./notificationService");
          await notificationService.createNotification(
            question.user_id,
            "reported",
            "Your question was reported.",
            `/questions/${questionId}`
          );
        } catch (err) {
          logger.error(`Failed to create question report notification: ${err.message}`);
        }
      }
    }

    return;
  } catch (error) {
    logger.error(`Error taking action on question ${questionId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error taking action on question.");
  }
};

// remove action on question
const removeActionByQuestionId = async (questionId, actionType, loginUser) => {
  try {
    logger.info(`User ${loginUser.id} removing action ${actionType} on question ${questionId}`);
    const action = await UserQuestionAction.findOne({
      where: {
        user_id: loginUser.id,
        question_id: questionId,
        action_type: actionType,
      },
    });

    if (!action) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "record not found");
    }

    await action.destroy();
  } catch (error) {
    logger.error(`Error removing action on question ${questionId}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error removing action on question.");
  }
};

module.exports = {
  createQuestion,
  getRecentQuestions,
  getPopularQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  takeActionByQuestionId,
  removeActionByQuestionId,
};
