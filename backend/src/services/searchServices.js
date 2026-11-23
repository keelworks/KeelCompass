const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const ActionTypes = require("../constants/actionTypes");
const { REACTION_TYPES } = require("../constants/reactionTypes");
const { Op } = require("sequelize");

const db = require("../models");
const Sequelize = db.Sequelize;
const User = db.User;
const Category = db.Category;
const Question = db.Question;
const Comment = db.Comment;
const Attachment = db.Attachment;
const QuestionTag = db.QuestionTag;

// search questions by keyword, with optional category/tag/status/date
// filters - respects tag-based visibility and excludes soft-deleted posts,
// same as the recent/popular feeds
const searchQuestionByKeyword = async (
  query = "",
  count = 10,
  offset = 0,
  categoryIds = [],
  hasNone = false,
  viewerTag = null,
  viewerUserId = null,
  filters = {}
) => {
  try {
    const trimmedQuery = String(query || "").trim();
    const keywords = trimmedQuery
      ? trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean)
      : [];
    const likeClauses = keywords.map(keyword => ({
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ],
    }));

    const whereClauses = [{ deleted_at: null }];
    if (likeClauses.length > 0) whereClauses.push({ [Op.or]: likeClauses });
    if (filters.status) whereClauses.push({ status: filters.status });
    if (filters.dateFrom) whereClauses.push({ created_at: { [Op.gte]: new Date(filters.dateFrom) } });
    if (filters.dateTo) whereClauses.push({ created_at: { [Op.lte]: new Date(filters.dateTo) } });

    // tag-based visibility: hide tagged questions the viewer doesn't match
    // (unless they're the author)
    const taggedRows = await QuestionTag.findAll({ attributes: ["question_id", "tag"] });
    const tagsByQuestion = new Map();
    for (const row of taggedRows) {
      if (!tagsByQuestion.has(row.question_id)) tagsByQuestion.set(row.question_id, []);
      tagsByQuestion.get(row.question_id).push(row.tag);
    }
    const hiddenIds = [];
    for (const [questionId, tags] of tagsByQuestion) {
      if (!viewerTag || !tags.includes(viewerTag)) hiddenIds.push(questionId);
    }
    if (hiddenIds.length > 0) {
      whereClauses.push({
        [Op.or]: [
          { id: { [Op.notIn]: hiddenIds } },
          ...(viewerUserId ? [{ user_id: viewerUserId }] : []),
        ],
      });
    }
    if (filters.tag) {
      const matchingIds = [...tagsByQuestion.entries()]
        .filter(([, tags]) => tags.includes(filters.tag))
        .map(([id]) => id);
      whereClauses.push({ id: { [Op.in]: matchingIds.length > 0 ? matchingIds : [-1] } });
    }

    // rank by actual text relevance (MySQL FULLTEXT) when there's a query,
    // instead of only ever sorting by recency - the WHERE clause above still
    // does the actual filtering via LIKE, so this only changes result order,
    // never which rows come back
    const escapedQuery = trimmedQuery ? db.sequelize.escape(trimmedQuery) : null;

    const reactionList = REACTION_TYPES.map((t) => `'${t}'`).join(",");

    const findOptions = {
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type IN (${reactionList}))`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.REPORT}')`), 'reportCount'],
          ...(escapedQuery
            ? [[Sequelize.literal(`MATCH(Question.title, Question.description) AGAINST(${escapedQuery} IN NATURAL LANGUAGE MODE)`), 'relevance']]
            : []),
        ],
      },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
        { model: Category, as: "Categories", attributes: ["id", "name"], through: { attributes: [] }, required: false },
        { model: Attachment, as: 'attachment', attributes: ['id', 'file_name', 'mime_type'], required: false },
        { model: Comment, as: 'comments', attributes: ['id'], required: false },
        { model: QuestionTag, as: 'tags', attributes: ['tag'], required: false },
      ],
      order: escapedQuery
        ? [[Sequelize.literal('relevance'), 'DESC'], ["created_at", "DESC"]]
        : [["created_at", "DESC"]],
      distinct: true,
      limit: count,
      offset: offset,
    };

    const categoryInclude = findOptions.include.find(i => i.as === 'Categories');

    if (hasNone) {
      whereClauses.push(
        Sequelize.where(
          Sequelize.literal(`NOT EXISTS (
            SELECT 1 FROM QuestionCategories qc
            WHERE qc.question_id = Question.id
          )`),
          true
        )
      );
    } else if (categoryIds.length > 0) {
      categoryInclude.where = { id: { [Op.in]: categoryIds } };
      categoryInclude.required = true;
    }

    findOptions.where = { [Op.and]: whereClauses };

    const { count: totalCount, rows: questions } = await Question.findAndCountAll(findOptions);
    const nextOffset = offset + questions.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(`Search results for questions with query: ${query}`);

    const questionsList = questions.map(q => ({
      id: q.id,
      user: {
        username: q.user?.username,
        email: q.user?.email,
        displayName: q.user?.display_name,
        pictureUrl: q.user?.picture_url,
        fullRoleTag: q.user?.full_role_tag,
      },
      title: q.title,
      description: q.description,
      status: q.status,
      createdAt: q.created_at,
      isInterested: false, // Not available in search context
      interestId: null,    // Not available in search context
      hasLiked: false,     // Not available in search context
      myReaction: null,    // Not available in search context
      likeCount: q.dataValues.likeCount ?? 0,
      commentCount: Array.isArray(q.comments) ? q.comments.length : 0,
      categories: Array.isArray(q.Categories) ? q.Categories.map((c) => ({ id: c.id, name: c.name })) : [],
      tags: Array.isArray(q.tags) ? q.tags.map((t) => t.tag) : [],
    }));

    // also search comment content - matches surface with a glimpse of the
    // post they belong to, so results aren't just "a post exists somewhere"
    // but can point straight at the actual answer/reply that matched
    let commentsList = [];
    if (keywords.length > 0) {
      const commentLikeClauses = keywords.map((keyword) => ({
        content: { [Op.like]: `%${keyword}%` },
      }));
      const hiddenQuestionIds = hiddenIds; // reuse the same tag-visibility computation as questions

      const matchingComments = await Comment.findAll({
        where: { [Op.and]: [{ deleted_at: null }, ...commentLikeClauses] },
        attributes: {
          include: escapedQuery
            ? [[Sequelize.literal(`MATCH(Comment.content) AGAINST(${escapedQuery} IN NATURAL LANGUAGE MODE)`), 'relevance']]
            : [],
        },
        include: [
          { model: User, as: "user", attributes: ["id", "username", "email", "display_name", "picture_url", "full_role_tag"] },
          {
            model: Question,
            as: "question",
            attributes: ["id", "title", "user_id", "deleted_at"],
            required: true,
          },
        ],
        order: escapedQuery
          ? [[Sequelize.literal('relevance'), 'DESC'], ["created_at", "DESC"]]
          : [["created_at", "DESC"]],
        limit: 10,
      });

      commentsList = matchingComments
        .filter((c) => {
          if (!c.question || c.question.deleted_at) return false;
          if (!hiddenQuestionIds.includes(c.question.id)) return true;
          return viewerUserId && c.question.user_id === viewerUserId;
        })
        .map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.created_at,
          user: {
            username: c.user?.username,
            email: c.user?.email,
            displayName: c.user?.display_name,
            pictureUrl: c.user?.picture_url,
            fullRoleTag: c.user?.full_role_tag,
          },
          questionId: c.question.id,
          questionTitle: c.question.title,
        }));
    }

    return {
      questions: questionsList,
      comments: commentsList,
      count: totalCount,
      offset: resOffset,
    };

  } catch (error) {
    logEverything(error, "searchServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error searching for questions.");
  }
};

module.exports = {
  searchQuestionByKeyword,
};
