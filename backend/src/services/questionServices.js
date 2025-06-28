const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const Attachment = db.Attachment;
const Comment = db.Comment;

// get recent questions
const getRecentQuestions = async (count = 10, offset = 0) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { count: totalCount, rows: questions } = await Question.findAndCountAll({
      include: [
        { model: User, as: "user", attributes: ["id", ["name", "username"]] },
        { model: UserQuestionAction, as: "userQuestionActions", attributes: ["action_type"] },
        { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type"] },
        { model: Comment, as: "comments", attributes: ["id"] },
      ],
      order: [["created_at", "DESC"]],
      limit: count,
      offset: offset,
      distinct: true
    });

    const questionsWithCounts = questions.map(q => {
      const uqas = Array.isArray(q.userQuestionActions) ? q.userQuestionActions : [];
      const likeCount = uqas.filter(a => a.action_type === "like").length;
      const reportCount = uqas.filter(a => a.action_type === "report").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      return {
        ...q.toJSON(),
        likeCount,
        reportCount,
        commentCount,
      };
    });

    const nextOffset = offset + questionsWithCounts.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(`Fetched ${questionsWithCounts.length} recent questions, totalCount: ${totalCount}, resOffset: ${resOffset}`);
    return [questionsWithCounts, totalCount, resOffset];
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching recent questions");
  }
};

// get popular questions
const getPopularQuestions = async (count = 10, offset = 0) => {
  try {
    const allQuestions = await Question.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", ["name", "username"]] },
        { model: UserQuestionAction, as: "userQuestionActions", attributes: ["action_type"] },
        { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type"] },
        { model: Comment, as: "comments", attributes: ["id"] },
      ],
    });

    const questionsWithScores = allQuestions.map(q => {
      const likeCount = q.userQuestionActions?.filter(a => a.action_type === "like").length || 0;
      const commentCount = q.comments?.length || 0;
      const popularityScore = likeCount + commentCount;
      return {
        ...q.toJSON(),
        likeCount,
        commentCount,
        popularityScore,
      };
    });

    const sortedQuestions = questionsWithScores
      .sort((a, b) => b.popularityScore - a.popularityScore || new Date(b.created_at) - new Date(a.created_at));

    const pagedQuestions = sortedQuestions.slice(offset, offset + count);
    const resOffset = offset + pagedQuestions.length >= sortedQuestions.length ? -1 : offset + pagedQuestions.length;

    return [pagedQuestions, sortedQuestions.length, resOffset];
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching popular questions");
  }
};

// create question
const createQuestion = async (userId, categoryIds, title, description, attachment = null) => {
  try {
    const newQuestion = await Question.create({
      user_id: userId,
      title: title,
      description: description,
    });

    // set categories
    if (categoryIds && categoryIds.length > 0) {
      await newQuestion.setCategories(categoryIds);
    }

    // create attachment
    if (attachment) {
      await attachmentService.createAttachment(attachment, { question_id: newQuestion.id });
    }

    logger.info(`Question created successfully with ID: ${newQuestion.id}`);
    return { message: "Question created successfully", questionId: newQuestion.id };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error creating question");
  }
};

// update question by id
const updateQuestion = async (userId, questionId, title, description, attachment = null) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId) throw new HttpError(401, "No permission to update question");

    question.title = title;
    question.description = description;
    await question.save();

    // update attachment
    if (attachment) {
      const existingAttachment = await Attachment.findOne({ where: { question_id: question.id } });
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, { question_id: question.id });
    }

    logger.info(`Question ${questionId} updated successfully`);
    return { message: "Question updated successfully", questionId: question.id };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating question");
  }
};

// delete question by id
const deleteQuestion = async (userId, questionId) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId) throw new HttpError(401, "No permission to delete question");

    await Question.destroy({ where: { id: questionId } });
    logger.info(`Question ${questionId} deleted successfully`);
    return { message: "Question deleted successfully", questionId: questionId };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting question.");
  }
};

module.exports = {
  getRecentQuestions,
  getPopularQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
