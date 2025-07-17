const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const Attachment = db.Attachment;
const Comment = db.Comment;
const Interest = db.Interest;
const attachmentService = require("./attachmentServices");

// get recent questions
const getRecentQuestions = async (userId, count = 10, offset = 0) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { count: totalCount, rows: questions } = await Question.findAndCountAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: UserQuestionAction, as: "userQuestionActions", attributes: ["user_id", "action_type"] },
        { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type"] },
        { model: Comment, as: "comments", attributes: ["id"] },
        { model: Interest, as: "interests", attributes: ["id", "user_id"] },
      ],
      order: [["created_at", "DESC"]],
      limit: count,
      offset: offset,
      distinct: true
    });

    const questionsWithCounts = questions.map(q => {
      const uqas = Array.isArray(q.userQuestionActions) ? q.userQuestionActions : [];
      const userInterest = Array.isArray(q.interests) ? q.interests.find(i => i.user_id === userId) : null;
      const isInterested = !!userInterest;
      const interestId = isInterested ? userInterest.id : null;
      const hasLiked = uqas.some(a => a.action_type === "like" && a.user_id === userId);
      const likeCount = uqas.filter(a => a.action_type === "like").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      return {
        id: q.id,
        user: { username: q.user?.username },
        title: q.title,
        description: q.description,
        status: q.status,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        isInterested,
        interestId,
        hasLiked,
        likeCount,
        commentCount,
      };
    });

    const nextOffset = offset + questionsWithCounts.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(`Fetched ${questionsWithCounts.length} recent questions, totalCount: ${totalCount}, resOffset: ${resOffset}`);
    return {
      questions: questionsWithCounts,
      total: totalCount,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching recent questions");
  }
};

// get popular questions
const getPopularQuestions = async (userId, count = 10, offset = 0) => {
  try {
    const allQuestions = await Question.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: UserQuestionAction, as: "userQuestionActions", attributes: ["user_id", "action_type"] },
        { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type"] },
        { model: Comment, as: "comments", attributes: ["id"] },
        { model: Interest, as: "interests", attributes: ["user_id"] },
      ],
    });

    const questionsWithScores = allQuestions.map(q => {
      const uqas = Array.isArray(q.userQuestionActions) ? q.userQuestionActions : [];
      const userInterest = Array.isArray(q.interests) ? q.interests.find(i => i.user_id === userId) : null;
      const isInterested = !!userInterest;
      const interestId = userInterest ? userInterest.id : null;
      const hasLiked = uqas.some(a => a.action_type === "like" && a.user_id === userId);
      const likeCount = uqas.filter(a => a.action_type === "like").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      const popularityScore = likeCount + commentCount;
      return {
        id: q.id,
        user: { username: q.user?.username },
        title: q.title,
        description: q.description,
        status: q.status,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        isInterested,
        interestId,
        hasLiked,
        likeCount,
        commentCount,
        popularityScore,
      };
    });

    const sortedQuestions = questionsWithScores
      .sort((a, b) => b.popularityScore - a.popularityScore || new Date(b.createdAt) - new Date(a.createdAt));

    const pagedQuestions = sortedQuestions.slice(offset, offset + count);
    const resOffset = offset + pagedQuestions.length >= sortedQuestions.length ? -1 : offset + pagedQuestions.length;

    return {
      questions: pagedQuestions,
      total: sortedQuestions.length,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching popular questions");
  }
};

// get pending questions (facilitator)
// inputs: userId, count, offset
// outputs: { questions, total, offset }
// CODE HERE THEN PUT CODE IN module.exports

// get question by id
const getQuestion = async (userId, questionId) => {
  try {
    const question = await Question.findByPk(questionId, {
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: UserQuestionAction, as: "userQuestionActions", attributes: ["user_id", "action_type"] },
        { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type", "data"] },
        {
          model: Comment,
          as: "comments",
          include: [
            { model: User, as: "user", attributes: ["id", "username"] },
            { model: Attachment, as: "attachment", attributes: ["id", "file_name", "mime_type"] },
            { model: db.UserCommentAction, as: "userCommentActions", attributes: ["user_id", "action_type"] },
          ],
        },
        { model: Interest, as: "interests", attributes: ["id", "user_id"] },
      ],
      order: [[{ model: Comment, as: "comments" }, "created_at", "ASC"]],
    });
    if (!question) throw new HttpError(404, "Question not found");

    const uqas = Array.isArray(question.userQuestionActions) ? question.userQuestionActions : [];
    const userInterest = Array.isArray(question.interests) ? question.interests.find(i => i.user_id === userId) : null;
    const isInterested = !!userInterest;
    const interestId = isInterested ? userInterest.id : null;
    const hasLiked = uqas.some(a => a.action_type === "like" && a.user_id === userId);
    const likeCount = uqas.filter(a => a.action_type === "like").length;
    const comments = Array.isArray(question.comments) ? question.comments.map(c => {
      const ucas = Array.isArray(c.userCommentActions) ? c.userCommentActions : [];
      const likeCount = ucas.filter(a => a.action_type === "like").length;
      const hasLiked = ucas.some(a => a.action_type === "like" && a.user_id === userId);
      return {
        id: c.id,
        user: { id: c.user?.id, username: c.user?.username },
        parentId: c.parent_id,
        content: c.content,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        attachment: c.attachment ? {
          id: c.attachment.id,
          fileName: c.attachment.file_name,
          mimeType: c.attachment.mime_type,
          data: c.attachment.data
            ? Buffer.isBuffer(c.attachment.data)
              ? c.attachment.data.toString('base64')
              : c.attachment.data
            : null,
        } : null,
        hasLiked,
        likeCount,
      };
    }) : [];

    const commentCount = comments.length;

    return {
      id: question.id,
      user: { id: question.user?.id, username: question.user?.username },
      title: question.title,
      description: question.description,
      status: question.status,
      createdAt: question.created_at,
      updatedAt: question.updated_at,
      attachment: question.attachment ? {
        id: question.attachment.id,
        fileName: question.attachment.file_name,
        mimeType: question.attachment.mime_type,
        data: question.attachment.data
          ? Buffer.isBuffer(question.attachment.data)
            ? question.attachment.data.toString('base64')
            : question.attachment.data
          : null,
      } : null,
      isInterested,
      interestId,
      hasLiked,
      likeCount,
      comments,
      commentCount,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching question");
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
    return newQuestion.id;
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
    const existingAttachment = await Attachment.findOne({ where: { question_id: question.id } });
    if (attachment) {
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, { question_id: question.id });
    } else if (existingAttachment) {
      await attachmentService.deleteAttachment(existingAttachment.id);
    }

    logger.info(`Question ${questionId} updated successfully`);
    return question.id;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating question");
  }
};

// update question status (facilitator)
// inputs: userId, questionId, status
// outputs: questionId
// CODE HERE THEN PUT CODE IN module.exports

const updateQuestionStatus = async (userId, questionId, status) => {
  try {
    // Find the question
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");

    // Optionally, check facilitator role here if not handled by middleware
    // Update status
    question.status = status;
    await question.save();

    logger.info(`Question ${questionId} status updated to ${status} by user ${userId}`);
    return question.id;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating question status");
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
    return questionId;
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting question.");
  }
};

module.exports = {
  getRecentQuestions,
  getPopularQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
};
