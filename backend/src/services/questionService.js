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
  });

  const totalCount = await Question.count();

  var resOffset = offset + questions.length;
  if (resOffset == totalCount) {
    resOffset = -1; // There's no more questions to return
  }

  return [questions, resOffset];
};

module.exports = {
  createQuestion,
  getQuestionList,
};
