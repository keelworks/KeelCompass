const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const UserQuestionAction = db.UserQuestionAction;
const UserCommentAction = db.UserCommentAction;
const Question = db.Question;
const Comment = db.Comment;
const User = db.User;

// list every open report against a question or a comment, for the admin
// moderation queue
const getReports = async () => {
  try {
    const questionReports = await UserQuestionAction.findAll({
      where: { action_type: "report" },
      include: [
        { model: Question, as: "question", attributes: ["id", "title", "deleted_at"] },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["created_at", "DESC"]],
    });
    const commentReports = await UserCommentAction.findAll({
      where: { action_type: "report" },
      include: [
        { model: Comment, as: "comment", attributes: ["id", "content", "question_id"] },
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["created_at", "DESC"]],
    });

    const questionEntries = questionReports
      .filter((r) => r.question && !r.question.deleted_at)
      .map((r) => ({
        id: r.id,
        type: "question",
        targetId: r.question.id,
        preview: r.question.title,
        reportedBy: { id: r.user?.id, username: r.user?.username, email: r.user?.email },
        createdAt: r.created_at,
      }));
    const commentEntries = commentReports
      .filter((r) => r.comment)
      .map((r) => ({
        id: r.id,
        type: "comment",
        targetId: r.comment.id,
        questionId: r.comment.question_id,
        preview: r.comment.content,
        reportedBy: { id: r.user?.id, username: r.user?.username, email: r.user?.email },
        createdAt: r.created_at,
      }));

    return [...questionEntries, ...commentEntries].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    logEverything(error, "moderationServices");
    throw new HttpError(500, "Error retrieving reports");
  }
};

// dismiss a report without removing the underlying content
const dismissReport = async (type, id) => {
  try {
    const Model = type === "comment" ? UserCommentAction : UserQuestionAction;
    const deleted = await Model.destroy({ where: { id, action_type: "report" } });
    if (!deleted) throw new HttpError(404, "Report not found");
  } catch (error) {
    logEverything(error, "moderationServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error dismissing report");
  }
};

module.exports = { getReports, dismissReport };
