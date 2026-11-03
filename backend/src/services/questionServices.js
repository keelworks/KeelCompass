const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const User = db.User;
const Question = db.Question;
const UserQuestionAction = db.UserQuestionAction;
const Attachment = db.Attachment;
const Comment = db.Comment;
const Category = db.Category;
const Interest = db.Interest;
const QuestionTag = db.QuestionTag;
const RoleTagMapping = db.RoleTagMapping;
const attachmentService = require("./attachmentServices");

// list every known tag a question can be restricted to (sourced from the
// admin-managed role mappings, so authors pick from the same tag vocabulary
// Google-derived roles already use)
const getKnownTags = async () => {
  try {
    const mappings = await RoleTagMapping.findAll({
      attributes: ["tag"],
      order: [["tag", "ASC"]],
    });
    return mappings.map((m) => m.tag);
  } catch (error) {
    logEverything(error, "questionServices");
    throw new HttpError(500, "Error fetching known tags");
  }
};

// a tagged question is only visible to a viewer whose own raw Google tag
// matches one of the question's tags (or an admin, who can see everything);
// an untagged question is visible to everyone - this is the default
const getHiddenQuestionIds = async (viewerTag, isAdmin) => {
  if (isAdmin) return [];

  const rows = await QuestionTag.findAll({ attributes: ["question_id", "tag"] });
  const tagsByQuestion = new Map();
  for (const row of rows) {
    if (!tagsByQuestion.has(row.question_id)) tagsByQuestion.set(row.question_id, []);
    tagsByQuestion.get(row.question_id).push(row.tag);
  }

  const hidden = [];
  for (const [questionId, tags] of tagsByQuestion) {
    if (!viewerTag || !tags.includes(viewerTag)) hidden.push(questionId);
  }
  return hidden;
};

// get recent questions
const getRecentQuestions = async (userId, count = 10, offset = 0, viewerTag = null, isAdmin = false) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const hiddenQuestionIds = await getHiddenQuestionIds(viewerTag, isAdmin);

    const { count: totalCount, rows: questions } =
      await Question.findAndCountAll({
        where: hiddenQuestionIds.length > 0 ? { id: { [db.Sequelize.Op.notIn]: hiddenQuestionIds } } : undefined,
        include: [
          { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url"] },
          {
            model: UserQuestionAction,
            as: "userQuestionActions",
            attributes: ["user_id", "action_type"],
          },
          {
            model: Attachment,
            as: "attachment",
            attributes: ["id", "file_name", "mime_type"],
          },
          { model: Comment, as: "comments", attributes: ["id"] },
          { model: Interest, as: "interests", attributes: ["id", "user_id"] },
          { model: Category, attributes: ["id", "name"] }, // Add this line
          { model: QuestionTag, as: "tags", attributes: ["tag"] },
        ],
        order: [["created_at", "DESC"]],
        limit: count,
        offset: offset,
        distinct: true,
      });

    const questionsWithCounts = questions.map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = isInterested ? userInterest.id : null;
      const hasLiked = uqas.some(
        (a) => a.action_type === "like" && a.user_id === userId
      );
      const likeCount = uqas.filter((a) => a.action_type === "like").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;

      // Map categories to a simple array
      const categories = Array.isArray(q.Categories)
        ? q.Categories.map((cat) => ({ id: cat.id, name: cat.name }))
        : [];
      const tags = Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [];

      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
        },
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
        categories, // Add this line
        tags,
      };
    });

    const nextOffset = offset + questionsWithCounts.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(
      `Fetched ${questionsWithCounts.length} recent questions, totalCount: ${totalCount}, resOffset: ${resOffset}`
    );
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
const getPopularQuestions = async (userId, count = 10, offset = 0, viewerTag = null, isAdmin = false) => {
  try {
    const hiddenQuestionIds = await getHiddenQuestionIds(viewerTag, isAdmin);
    const hiddenSet = new Set(hiddenQuestionIds);

    const allQuestions = await Question.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url"] },
        {
          model: UserQuestionAction,
          as: "userQuestionActions",
          attributes: ["user_id", "action_type"],
        },
        {
          model: Attachment,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type"],
        },
        { model: Comment, as: "comments", attributes: ["id"] },
        { model: Interest, as: "interests", attributes: ["user_id"] },
        { model: QuestionTag, as: "tags", attributes: ["tag"] },
      ],
    });

    const questionsWithScores = allQuestions
      .filter((q) => !hiddenSet.has(q.id))
      .map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = userInterest ? userInterest.id : null;
      const hasLiked = uqas.some(
        (a) => a.action_type === "like" && a.user_id === userId
      );
      const likeCount = uqas.filter((a) => a.action_type === "like").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      const popularityScore = likeCount + commentCount;
      const tags = Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [];
      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
        },
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
        tags,
      };
    });

    const sortedQuestions = questionsWithScores.sort(
      (a, b) =>
        b.popularityScore - a.popularityScore ||
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const pagedQuestions = sortedQuestions.slice(offset, offset + count);
    const resOffset =
      offset + pagedQuestions.length >= sortedQuestions.length
        ? -1
        : offset + pagedQuestions.length;

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
const getPendingQuestions = async (userId, count = 10, offset = 0) => {
  try {
    count = parseInt(count, 10);
    offset = parseInt(offset, 10);
    if (isNaN(count) || count <= 0) count = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { count: totalCount, rows: questions } =
      await Question.findAndCountAll({
        where: { status: "pending" },
        include: [
          { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url"] },
          {
            model: UserQuestionAction,
            as: "userQuestionActions",
            attributes: ["user_id", "action_type"],
          },
          {
            model: Attachment,
            as: "attachment",
            attributes: ["id", "file_name", "mime_type"],
          },
          { model: Comment, as: "comments", attributes: ["id"] },
          { model: Interest, as: "interests", attributes: ["id", "user_id"] },
        ],
        order: [["created_at", "DESC"]],
        limit: count,
        offset: offset,
        distinct: true,
      });

    const questionsWithCounts = questions.map((q) => {
      const uqas = Array.isArray(q.userQuestionActions)
        ? q.userQuestionActions
        : [];
      const userInterest = Array.isArray(q.interests)
        ? q.interests.find((i) => i.user_id === userId)
        : null;
      const isInterested = !!userInterest;
      const interestId = isInterested ? userInterest.id : null;
      const hasLiked = uqas.some(
        (a) => a.action_type === "like" && a.user_id === userId
      );
      const likeCount = uqas.filter((a) => a.action_type === "like").length;
      const comments = Array.isArray(q.comments) ? q.comments : [];
      const commentCount = comments.length;
      return {
        id: q.id,
        user: {
          username: q.user?.username,
          email: q.user?.email,
          displayName: q.user?.display_name,
          pictureUrl: q.user?.picture_url,
        },
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
    logger.info(
      "Fetched ${questionsWithCounts.length} pending questions, totalCount: ${totalCount}, resOffset: ${resOffset}"
    );
    return {
      questions: questionsWithCounts,
      total: totalCount,
      offset: resOffset,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching pending questions");
  }
};

// get question by id
const getQuestion = async (userId, questionId, viewerTag = null, isAdmin = false) => {
  try {
    const question = await Question.findByPk(questionId, {
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url"] },
        {
          model: UserQuestionAction,
          as: "userQuestionActions",
          attributes: ["user_id", "action_type"],
        },
        {
          model: Attachment,
          as: "attachment",
          attributes: ["id", "file_name", "mime_type", "data"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url"] },
            {
              model: Attachment,
              as: "attachment",
              attributes: ["id", "file_name", "mime_type"],
            },
            {
              model: db.UserCommentAction,
              as: "userCommentActions",
              attributes: ["user_id", "action_type"],
            },
          ],
        },
        { model: Interest, as: "interests", attributes: ["id", "user_id"] },
        { model: QuestionTag, as: "tags", attributes: ["tag"] },
      ],
      order: [[{ model: Comment, as: "comments" }, "created_at", "ASC"]],
    });
    if (!question) throw new HttpError(404, "Question not found");

    const tags = Array.isArray(question.tags) ? question.tags.map((t) => t.tag) : [];
    const isVisible = isAdmin || tags.length === 0 || (viewerTag && tags.includes(viewerTag));
    if (!isVisible) throw new HttpError(404, "Question not found");

    const uqas = Array.isArray(question.userQuestionActions)
      ? question.userQuestionActions
      : [];
    const userInterest = Array.isArray(question.interests)
      ? question.interests.find((i) => i.user_id === userId)
      : null;
    const isInterested = !!userInterest;
    const interestId = isInterested ? userInterest.id : null;
    const hasLiked = uqas.some(
      (a) => a.action_type === "like" && a.user_id === userId
    );
    const likeCount = uqas.filter((a) => a.action_type === "like").length;
    const comments = Array.isArray(question.comments)
      ? question.comments.map((c) => {
          const ucas = Array.isArray(c.userCommentActions)
            ? c.userCommentActions
            : [];
          const likeCount = ucas.filter((a) => a.action_type === "like").length;
          const hasLiked = ucas.some(
            (a) => a.action_type === "like" && a.user_id === userId
          );
          return {
            id: c.id,
            user: { id: c.user?.id, username: c.user?.username },
            parentId: c.parent_id,
            content: c.content,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
            attachment: c.attachment
              ? {
                  id: c.attachment.id,
                  fileName: c.attachment.file_name,
                  mimeType: c.attachment.mime_type,
                  data: c.attachment.data
                    ? Buffer.isBuffer(c.attachment.data)
                      ? c.attachment.data.toString("base64")
                      : c.attachment.data
                    : null,
                }
              : null,
            hasLiked,
            likeCount,
          };
        })
      : [];

    const commentCount = comments.length;

    return {
      id: question.id,
      user: {
        id: question.user?.id,
        username: question.user?.username,
        email: question.user?.email,
        displayName: question.user?.display_name,
        pictureUrl: question.user?.picture_url,
      },
      title: question.title,
      description: question.description,
      status: question.status,
      createdAt: question.created_at,
      updatedAt: question.updated_at,
      attachment: question.attachment
        ? {
            id: question.attachment.id,
            fileName: question.attachment.file_name,
            mimeType: question.attachment.mime_type,
            data: question.attachment.data
              ? Buffer.isBuffer(question.attachment.data)
                ? question.attachment.data.toString("base64")
                : question.attachment.data
              : null,
          }
        : null,
      isInterested,
      interestId,
      hasLiked,
      likeCount,
      comments,
      commentCount,
      tags,
    };
  } catch (error) {
    logEverything(error, "questionServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching question");
  }
};

// de-dupe/trim a raw tags list into the form stored on QuestionTag rows
const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  const trimmed = tags.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean);
  return [...new Set(trimmed)];
};

// create question
const createQuestion = async (
  userId,
  categoryIds,
  title,
  description,
  attachment = null,
  tags = []
) => {
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

    // set tags (restricts visibility to users with a matching raw role tag)
    const normalizedTags = normalizeTags(tags);
    if (normalizedTags.length > 0) {
      await QuestionTag.bulkCreate(
        normalizedTags.map((tag) => ({ question_id: newQuestion.id, tag }))
      );
    }

    // create attachment
    if (attachment) {
      await attachmentService.createAttachment(attachment, {
        question_id: newQuestion.id,
      });
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
const updateQuestion = async (
  userId,
  questionId,
  title,
  description,
  attachment = null,
  tags
) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");
    if (question.user_id !== userId)
      throw new HttpError(401, "No permission to update question");

    question.title = title;
    question.description = description;
    await question.save();

    // replace tags, only if the caller actually sent a tags field
    if (tags !== undefined) {
      await QuestionTag.destroy({ where: { question_id: question.id } });
      const normalizedTags = normalizeTags(tags);
      if (normalizedTags.length > 0) {
        await QuestionTag.bulkCreate(
          normalizedTags.map((tag) => ({ question_id: question.id, tag }))
        );
      }
    }

    // update attachment
    const existingAttachment = await Attachment.findOne({
      where: { question_id: question.id },
    });
    if (attachment) {
      if (existingAttachment) {
        await attachmentService.deleteAttachment(existingAttachment.id);
      }
      await attachmentService.createAttachment(attachment, {
        question_id: question.id,
      });
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
const updateQuestionStatus = async (questionId, status) => {
  try {
    const question = await Question.findByPk(questionId);
    if (!question) throw new HttpError(404, "Question not found");

    question.status = status;
    await question.save();

    logger.info(`Question ${questionId} status updated to ${status}`);
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
    if (question.user_id !== userId)
      throw new HttpError(401, "No permission to delete question");

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
  getPendingQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
  getKnownTags,
};
