const db = require("../models/index");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
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
    .catch((error) => {
      logger.error("Error creating question: " + error.message || error);
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Server error" });
      }
    });
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
    .catch((error) => {
      logger.error(error.message || error);
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    });
};

module.exports = {
  createQuestion,
  getQuestionList,
};
