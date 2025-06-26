const questionService = require("../services/questionService");
const attachmentService = require("../services/attachmentService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { IsValidAction } = require("../utils/actionTypes");

// post question
const createQuestion = async (req, res) => {
  try {
    logger.debug(`create question request, body = ${util.inspect(req.body)}`);
    logger.debug(`create question request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { title, description, categoryIds } = req.body;
    const attachment = req.file;

    let parsedCategoryIds = [];
    if (categoryIds) {
      try {
        // categoryIds might be a string from form-data, so parse it.
        parsedCategoryIds = typeof categoryIds === 'string' ? JSON.parse(categoryIds) : categoryIds;
      } catch (e) {
        logger.warn("Could not parse categoryIds");
      }
    }

    const questionId = await questionService.createQuestion(title, description, parsedCategoryIds, loginUser);

    if (attachment) {
      await attachmentService.createAttachment(attachment, { question_id: questionId });
    }

    res.status(HttpStatusCodes.CREATED).json({
      message: "Question created successfully",
      questionId: questionId,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "createQuestion");
  }
};

// get recent questions
const getRecentQuestions = async (req, res) => {
  try {
    logger.debug(`get recent questions request, query params = ${util.inspect(req.query)}`);
    const { count, offset } = req.query;

    const [questions, newOffset, total] = await questionService.getRecentQuestions(Number(count), Number(offset));
    return res.status(HttpStatusCodes.OK).json({ message: "success", questions: questions, offset: newOffset, total: total });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getRecentQuestions");
  }
};

// get popular questions
const getPopularQuestions = async (req, res) => {
  try {
    logger.debug(`get popular questions request, query params = ${util.inspect(req.query)}`);
    const { count, offset } = req.query;

    const [questions, newOffset, total] = await questionService.getPopularQuestions(Number(count), Number(offset));
    return res.status(HttpStatusCodes.OK).json({ message: "success", questions: questions, offset: newOffset, total: total });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getPopularQuestions");
  }
};

// get question by id
const getQuestionById = async (req, res) => {
  try {
    logger.debug(`get question by ID request, params = ${util.inspect(req.params)}`);
    const { questionId } = req.params;

    const question = await questionService.getQuestionById(questionId);
    return res.status(HttpStatusCodes.OK).json({ message: "success", question: question }); 
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getQuestionById");
  }
};

// update question by id
const updateQuestionById = async (req, res) => {
  try {
    logger.debug(`update question request, body = ${util.inspect(req.body)}`);
    logger.debug(`update question request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { title, description, questionId, deleteAttachment } = req.body;
    const attachment = req.file;

    await questionService.updateQuestionById(questionId, title, description, loginUser);

    const existingAttachment = await attachmentService.getAttachmentByOwner({ question_id: questionId });

    if (attachment) {
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, { question_id: questionId });
    } else if (deleteAttachment && existingAttachment) {
      await attachmentService.deleteAttachment(existingAttachment.id);
    }

    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "updateQuestion");
  }
};

// delete question by id
const deleteQuestionById = async (req, res) => {
  try {
    logger.debug(`delete question request, query params = ${util.inspect(req.query)}`);
    logger.debug(`delete question request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { questionId } = req.query;

    await questionService.deleteQuestionById(questionId, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "deleteQuestionById");
  }
};

// take action on question
const takeActionByQuestionId = async (req, res) => {
  try {
    logger.debug(`take action on question request, body = ${util.inspect(req.body)}`);
    logger.debug(`take action on question request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { questionId, actionType } = req.body;

    if (!IsValidAction(actionType)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
    }

    await questionService.takeActionByQuestionId(questionId, actionType, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "takeAction");
  }
};

// remove action on question
const removeActionByQuestionId = async (req, res) => {
  try {
    logger.debug(`remove action on question request, body = ${util.inspect(req.body)}`);
    logger.debug(`remove action on question request, loginUser = ${util.inspect(req.loginUser)}`);
    const loginUser = req.loginUser;
    const { questionId, actionType } = req.body;

    if (!IsValidAction(actionType)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
    }

    await questionService.removeActionByQuestionId(questionId, actionType, loginUser);
    return res.status(HttpStatusCodes.OK).json({ message: "success" });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "removeAction");
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
