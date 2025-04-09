const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const User = db.users;
const Question = db.questions;
const Comment = db.comments;

// post comment
const createComment = async (questionID, content, loginUser) => {
  const question = await Question.findByPk(questionID);
  if (!question) {
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "question not found");
  }

  const newComment = await Comment.create({
    content: content,
    question_id: questionID,
    user_id: loginUser.id,
  });

  return newComment.id;
};

// get all comments by question id
const getCommentListByQuestionID = async (questionID, count, offset) => {
  const comments = await Comment.findAll({
    order: [["created_at"]],
    where: {
      question_id: questionID,
    },
    limit: count,
    offset: offset,
    include: {
      model: User,
      as: "user",
      attributes: ["id", "username"],
    },
    attributes: ["id", "content", "created_at"],
  });

  const totalCount = await Comment.count({
    where: {
      question_id: questionID,
    },
  });

  var resOffset = offset + comments.length;
  if (resOffset >= totalCount) {
    resOffset = -1;
  }

  return [comments, resOffset, totalCount];
};

// update comment by id
const updateComment = async (commentID, content, loginUser) => {
  const comment = await Comment.findByPk(commentID);
  if (!comment) {
    logger.warn("Warning deleting comment: comment not found. ID = " + commentID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
  }

  if (comment.user_id != loginUser.id) {
    logger.warn("Warning deleting comment: no permission to edit");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  comment.content = content;

  await comment.save();
};

// delete comment by id
const deleteCommentByID = async (commentID, loginUser) => {
  const comment = await Comment.findByPk(commentID);
  if (!comment) {
    logger.warn("Warning deleting comment: comment not found. ID = " + commentID);
    throw new HttpError(HttpStatusCodes.NOT_FOUND, "comment not found");
  }

  if (comment.user_id != loginUser.id) {
    logger.warn("Warning deleting comment: no permission to delete");
    throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
  }

  await Comment.destroy({ where: { id: commentID } });

  return;
};

module.exports = {
  createComment,
  getCommentListByQuestionID,
  updateComment,
  deleteCommentByID,
};
