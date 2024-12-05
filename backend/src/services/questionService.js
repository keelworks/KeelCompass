const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const logger = require("../utils/logger");
const db = require("../models/index");
const User = db.users;
const Question = db.questions;

const createQuestion = async (title, description, loginUserID) => {
  const user = await User.findByPk(loginUserID);
  if (!user) {
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
  }

  // Create the question
  const newQuestion = await Question.create({
    title,
    description,
    user_id: user.id,
  });

  return newQuestion.id;
};

const getQuestionList = async (count, offset) => {
  const questions = await Question.findAll({
    order: [["created_at", "DESC"]],
    limit: count,
    offset: offset,
    include: {
      model: User,
      as: "user",
      attributes: ["id", "username"],
    },
    attributes: ["id", "title", "description", "created_at"],
  });

  const totalCount = await Question.count();

  var resOffset = offset + questions.length;
  if (resOffset == totalCount) {
    resOffset = -1; // There's no more questions to return
  }

  return [questions, resOffset];
};

const deleteQuestionByID = async (questionID, loginUserID) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    logger.warn(
      "Warning deleting question: question not found. ID = " + questionID
    );
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  if (question.user_id != loginUserID) {
    logger.warn("Warning deleting question: no permission to delete");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  await Question.destroy({ where: { id: questionID } });

  return;
};

const updateQuestion = async (questionID, title, description, loginUserID) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    logger.warn(
      "Warning updating updating: question not found. ID = " + questionID
    );
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  if (question.user_id != loginUserID) {
    logger.warn("Warning updating question: no permission to delete");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  if (title) question.title = title;
  if (description) question.description = description;

  await question.save();
};

const getQuestionByID = async (questionID) => {
  const question = await Question.findByPk(questionID, {
    include: {
      model: User,
      as: "user",
      attributes: ["id", "username"],
    },
    attributes: ["id", "title", "description", "created_at"],
  });

  if (!question) {
    logger.warn(
      "Warning get question by ID: question not found. ID = " + questionID
    );
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  return packQuestionResponse(question);
};

module.exports = {
  createQuestion,
  getQuestionList,
  deleteQuestionByID,
  updateQuestion,
  getQuestionByID,
};
