const questionService = require("../services/questionService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { IsValidAction } = require("../utils/actionTypes");
const checkAttachment = require("../utils/checkAttachment");

// post question
const createQuestion = async (req, res) => {
  logger.debug(`create question request, body = ${util.inspect(req.body)}`);
  logger.debug(`create question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { title, description, attachment } = req.body;

  if (attachment !== undefined && !checkAttachment(attachment)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid attachment format" });
  }

  const attachmentData = attachment ?? [];

  questionService
    .createQuestion(title, description, loginUser, attachmentData)
    .then((questionID) => {
      res.status(HttpStatusCodes.CREATED).json({
        message: "Question created successfully",
        questionID: questionID,
      });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "createQuestion"));
  return;
};

// get recent questions
const getRecentQuestions = async (req, res) => {
  logger.debug(`get recent questions request, query params = ${util.inspect(req.query)}`);
  const { count, offset } = req.query;

  questionService
    .getRecentQuestions(Number(count), Number(offset))
    .then(([questions, offset, total]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", questions: questions, offset: offset, total: total });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getRecentQuestions"));
};

// get popular questions
const getPopularQuestions = async (req, res) => {
  logger.debug(`get popular questions request, query params = ${util.inspect(req.query)}`);
  const { count, offset } = req.query;

  questionService
    .getPopularQuestions(Number(count), Number(offset))
    .then(([questions, offset, total]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", questions: questions, offset: offset, total: total });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getPopularQuestions"));
};

// get question by id
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

// update question by id
const updateQuestionByID = async (req, res) => {
  logger.debug(`update question request, body = ${util.inspect(req.body)}`);
  logger.debug(`update question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { title, description, questionID, attachment } = req.body;

  if (attachment !== undefined && !checkAttachment(attachment)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid attachment format" });
  }

  const attachmentData = attachment ?? [];

  questionService
    .updateQuestionByID(questionID, title, description, loginUser, attachmentData)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "updateQuestion"));
};

// delete question by id
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

// take action on question
const takeActionByQuestionID = async (req, res) => {
  logger.debug(`take action on question request, body = ${util.inspect(req.body)}`);
  logger.debug(`take action on question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { questionID, actionType } = req.body;

  if (!IsValidAction(actionType)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
  }

  questionService
    .takeActionByQuestionID(questionID, actionType, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "takeAction"));
  return;
};

// remove action on question
const removeActionByQuestionID = async (req, res) => {
  logger.debug(`remove action on question request, body = ${util.inspect(req.body)}`);
  logger.debug(`remove action on question request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { questionID, actionType } = req.body;

  if (!IsValidAction(actionType)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
  }

  questionService
    .removeActionByQuestionID(questionID, actionType, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "removeAction"));
  return;
};

module.exports = {
  createQuestion,
  getRecentQuestions,
  getPopularQuestions,
  getQuestionByID,
  updateQuestionByID,
  deleteQuestionByID,
  takeActionByQuestionID,
  removeActionByQuestionID,
};
