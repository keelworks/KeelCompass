const db = require("../models/index");
const { HttpError, HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const logger = require("../utils/logger");
const util = require("util");
const questionService = require("../services/questionService");

// POST /questions - Create a question
const createQuestion = async (req, res) => {
  logger.debug(`create question request, body = ${util.inspect(req.body)}`);
  logger.debug(`create question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { title, description } = req.body;

  questionService
    .createQuestion(title, description, loginUser)
    .then((questionID) => {
      res.status(HttpStatusCodes.CREATED).json({
        message: "Question created successfully",
        questionID: questionID,
      });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "createQuestion"));
  return;
};

const getQuestionList = async (req, res) => {
  logger.debug(`get question request, query params = ${util.inspect(req.query)}`);
  const { count, offset } = req.query;

  questionService
    .getQuestionList(Number(count), Number(offset))
    .then(([questions, offset, total]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", questions: questions, offset: offset, total: total });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getQuestionList"));
};

const deleteQuestionByID = async (req, res) => {
  logger.debug(`delete question request, query params = ${util.inspect(req.query)}`);
  logger.debug(`delete question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { questionID } = req.query;

  questionService
    .deleteQuestionByID(questionID, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "deleteQuestionByID"));
};

const updateQuestion = async (req, res) => {
  logger.debug(`update question request, body = ${util.inspect(req.body)}`);
  logger.debug(`update question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { title, description, questionID } = req.body;

  questionService
    .updateQuestion(questionID, title, description, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "updateQuestion"));
};

const getQuestionByID = async (req, res) => {
  logger.debug(`get question by ID request, params = ${util.inspect(req.params)}`);
  const { questionID } = req.params;

  questionService
    .getQuestionByID(questionID)
    .then((question) => {
      return res.status(HttpStatusCodes.OK).json({ message: "success", question: question });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getQuestionByID"));
};

module.exports = {
  createQuestion,
  getQuestionList,
  deleteQuestionByID,
  updateQuestion,
  getQuestionByID,
};
