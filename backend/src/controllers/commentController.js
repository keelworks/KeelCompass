const commentService = require("../services/commentService");
const util = require("util");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

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
const getCommentListByQuestionID = async (req, res) => {
  logger.debug(`get comment list by question ID request, query params = ${util.inspect(req.query)}`);
  // logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const { questionID, count, offset } = req.query;
  // const loginUser = req.loginUser;

  commentService
    .getCommentListByQuestionID(questionID, Number(count), Number(offset))
    .then(([comments, offset, total]) => {
      return res
        .status(HttpStatusCodes.OK)
        .json({ message: "success", comments: comments, offset: offset, total: total });
    })
    .catch((error) => ServiceErrorHandler(error, res, logger, "getCommentListByQuestionID"));
};

// update comment by id
const updateComment = async (req, res) => {
  logger.debug(`update comment request, body = ${util.inspect(req.body)}`);
  logger.debug(`update comment request, loginUser = ${util.inspect(req.loginUser)}`);
  const { commentID, content } = req.body;
  const loginUser = req.loginUser;

  commentService
    .updateComment(commentID, content, loginUser)
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

module.exports = {
  createComment,
  getCommentListByQuestionID,
  updateComment,
  deleteCommentByID,
};
