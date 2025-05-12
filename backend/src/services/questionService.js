const db = require("../models");
const ActionTypes = require("../constants/actionTypes");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const Sequelize = db.sequelize;
const User = db.users;
const Question = db.questions;
const UserQuestionAction = db.userQuestionActions;

// post question
const createQuestion = async (title, description, loginUser, attachment) => {
  const user = await User.findByPk(loginUser.id);
  if (!user) {
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
  }

  const newQuestion = await Question.create({
    title,
    description,
    user_id: user.id,
    attachment: attachment,
  });

  return newQuestion.id;
};

// get all questions
const getQuestions = async (count, offset) => {
  const query = `
  SELECT 
    Questions.id,
    Questions.title,
    Questions.description,
    Questions.attachment,
    Questions.created_at,
    (
      SELECT JSON_OBJECT('id', Users.id, 'username', Users.username)
      FROM Users
      WHERE Users.id = Questions.user_id
      LIMIT 1
    ) AS user,
    (
      SELECT COUNT(*)
      FROM UserQuestionActions
      WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :likeAction
    ) AS likeCount,
    (
      SELECT COUNT(*)
      FROM UserQuestionActions
      WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :reportAction
    ) AS reportCount
  FROM Questions
  ORDER BY Questions.created_at DESC
  LIMIT :limit OFFSET :offset
`;

  const replacements = {
    likeAction: ActionTypes.LIKE,
    reportAction: ActionTypes.REPORT,
    limit: count,
    offset: offset,
  };

  const questions = await Sequelize.query(query, { replacements, type: Sequelize.QueryTypes.SELECT });
  questions.forEach((row) => {
    row.attachment = row.attachment ?? [];
  });

  const totalCount = await Question.count();

  var resOffset = offset + questions.length;
  if (resOffset >= totalCount) {
    resOffset = -1;
  }

  return [questions, resOffset, totalCount];
};

// get question by id
const getQuestionByID = async (questionID) => {
  const [question] = await Sequelize.query(
    `
    SELECT 
      Questions.id,
      Questions.title,
      Questions.description,
      Questions.attachment,
      Questions.created_at,
      (
        SELECT JSON_OBJECT('id', Users.id, 'username', Users.username)
        FROM Users
        WHERE Users.id = Questions.user_id
        LIMIT 1
      ) AS user,
      (
        SELECT COUNT(*)
        FROM UserQuestionActions
        WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :likeAction
      ) AS likeCount,
      (
        SELECT COUNT(*)
        FROM UserQuestionActions
        WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :reportAction
      ) AS reportCount
    FROM Questions
    WHERE Questions.id = :questionID
    `,
    {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        likeAction: ActionTypes.LIKE,
        reportAction: ActionTypes.REPORT,
        questionID: questionID,
      },
    }
  );

  logger.debug(question);
  if (!question) {
    logger.warn("Warning get question by ID: question not found. ID = " + questionID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  question.attachment = question.attachment ?? [];

  return question;
};

// update question by id
const updateQuestionByID = async (questionID, title, description, loginUser) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    logger.warn("Warning updating question: question not found. ID = " + questionID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  if (question.user_id != loginUser.id) {
    logger.warn("Warning updating question: no permission to delete");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  if (title) question.title = title;
  if (description) question.description = description;

  await question.save();
};

// delete question by id
const deleteQuestionByID = async (questionID, loginUser) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    logger.warn("Warning deleting question: question not found. ID = " + questionID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  if (question.user_id != loginUser.id) {
    logger.warn("Warning deleting question: no permission to delete");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  await Question.destroy({ where: { id: questionID } });

  return;
};

// take action on question
const takeActionByQuestionID = async (questionID, actionType, loginUser) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    logger.warn("Warning adding actions: question not found. ID = " + questionID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  const [action, created] = await UserQuestionAction.findOrCreate({
    where: {
      user_id: loginUser.id,
      question_id: questionID,
      action_type: actionType,
    },
    defaults: {
      user_id: loginUser.id,
      question_id: questionID,
      action_type: actionType,
    },
  });

  if (!created) {
    logger.warn("Warning adding actions: action existed");
    throw new HttpError(HttpStatusCodes.CONFLICT, "record existed");
  }

  return;
};

// remove action on question
const removeActionByQuestionID = async (questionID, actionType, loginUser) => {
  const action = await UserQuestionAction.findOne({
    where: {
      user_id: loginUser.id,
      question_id: questionID,
      action_type: actionType,
    },
  });

  if (!action) {
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "record not found");
  }

  await action.destroy();

  return;
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionByID,
  updateQuestionByID,
  deleteQuestionByID,
  takeActionByQuestionID,
  removeActionByQuestionID,
};
