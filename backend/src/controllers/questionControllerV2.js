const db = require("../models/index");
const {
  HttpError,
  HttpStatusCodes,
  ServiceErrorHandler,
} = require("../utils/httpError");
const logger = require("../utils/logger");
const util = require("util");
const questionService = require("../services/questionService");

// POST /questions - Create a question
const createQuestion = async (req, res) => {
  logger.debug(`create question request, body = ${util.inspect(req.body)}`);
  const { title, description, loginUserID } = req.body;

  questionService
    .createQuestion(title, description, loginUserID)
    .then((questionID) => {
      res.status(HttpStatusCodes.CREATED).json({
        message: "Question created successfully",
        questionID: questionID,
      });
    })
    .catch((error) =>
      ServiceErrorHandler(error, res, logger, "createQuestion")
    );
  return;
};

const getQuestionList = async (req, res) => {
  logger.debug(
    `get question request, query params = ${util.inspect(req.query)}`
  );
  const { count, offset } = req.query;

  questionService
    .getQuestionList(Number(count), Number(offset))
    .then(([questions, offset]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", questions: questions, offset: offset });
    })
    .catch((error) =>
      ServiceErrorHandler(error, res, logger, "getQuestionList")
    );
};

const deleteQuestionByID = async (req, res) => {
  logger.debug(
    `delete question request, query params = ${util.inspect(req.query)}`
  );
  const { questionID, loginUserID } = req.query;

  questionService
    .deleteQuestionByID(questionID, loginUserID)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) =>
      ServiceErrorHandler(error, res, logger, "deleteQuestionByID")
    );
};

const updateQuestion = async (req, res) => {
  logger.debug(`update question request, body = ${util.inspect(req.body)}`);
  const { title, description, loginUserID, questionID } = req.body;

  questionService
    .updateQuestion(questionID, title, description, loginUserID)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) =>
      ServiceErrorHandler(error, res, logger, "updateQuestion")
    );
};

const getQuestionByID = async (req, res) => {
  logger.debug(
    `get question by ID request, params = ${util.inspect(req.params)}`
  );
  const { questionID } = req.params;

  questionService
    .getQuestionByID(questionID)
    .then((question) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", question: question });
    })
    .catch((error) =>
      ServiceErrorHandler(error, res, logger, "getQuestionByID")
    );
};

module.exports = {
  createQuestion,
  getQuestionList,
  deleteQuestionByID,
  updateQuestion,
  getQuestionByID,
};
