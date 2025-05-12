const commentService = require("../services/commentService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");
const { IsValidAction } = require("../utils/actionTypes");

// post comment
const createComment = async (req, res) => {
  logger.debug(`create comment request, body = ${util.inspect(req.body)}`);
  logger.debug(`create comment request, loginUser = ${util.inspect(req.loginUser)}`);

  const { questionID, content } = req.body;
  const loginUser = req.loginUser;

  commentService
    .createComment(questionID, content, loginUser)
    .then((commentID) => {
      res.status(HttpStatusCodes.CREATED).json({
        message: "Comment created successfully",
        commentID: commentID,
      });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "createComment"));
  return;
};

// get all comments by question id
const getCommentsByQuestionID = async (req, res) => {
  logger.debug(`get comment list by question ID request, query params = ${util.inspect(req.query)}`);
  const { questionID, count, offset } = req.query;

  commentService
    .getCommentsByQuestionID(questionID, Number(count), Number(offset))
    .then(([comments, offset, total]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", comments: comments, offset: offset, total: total });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getCommentListByQuestionID"));
};

// update comment by id
const updateCommentByID = async (req, res) => {
  logger.debug(`update comment request, body = ${util.inspect(req.body)}`);
  logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const { commentID, content } = req.body;
  const loginUser = req.loginUser;

  commentService
    .updateCommentByID(commentID, content, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "updateComment"));
};

// delete comment by id
const deleteCommentByID = async (req, res) => {
  logger.debug(`delete comment request, query params = ${util.inspect(req.query)}`);
  logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const { commentID } = req.query;
  const loginUser = req.loginUser;

  commentService
    .deleteCommentByID(commentID, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "deleteCommentByID"));
};

// take action on comment
const takeActionByCommentID = async (req, res) => {
  logger.debug(`take action on comment request, body = ${util.inspect(req.body)}`);
  logger.debug(`take action on comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { commentID, actionType } = req.body;

  if (!IsValidAction(actionType)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
  }

  commentService
    .takeActionByCommentID(commentID, actionType, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "takeAction"));
  return;
};

// remove action on comment
const removeActionByCommentID = async (req, res) => {
  logger.debug(`remove action on comment request, body = ${util.inspect(req.body)}`);
  logger.debug(`remove action on comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const loginUser = req.loginUser;
  const { commentID, actionType } = req.body;

  if (!IsValidAction(actionType)) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "invalid actionType" });
  }

  commentService
    .removeActionByCommentID(commentID, actionType, loginUser)
    .then(() => {
      return res.status(HttpStatusCodes.OK).json({ message: "success" });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "removeAction"));
  return;
};

module.exports = {
  createComment,
  getCommentsByQuestionID,
  updateCommentByID,
  deleteCommentByID,
  takeActionByCommentID,
  removeActionByCommentID,
};
