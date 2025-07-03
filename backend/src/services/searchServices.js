const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const ActionTypes = require("../constants/actionTypes");
const { Op } = require("sequelize");

const db = require("../models");
const Sequelize = db.Sequelize;
const User = db.User;
const Category = db.Category;
const Question = db.Question;
const Comment = db.Comment;
const Attachment = db.Attachment;

// search questions by keyword
const searchQuestionByKeyword = async (query, count = 10, offset = 0, categoryIds = [], hasNone = false) => {
  // DEBUG: Log input arguments
  console.log('searchQuestionByKeyword called with:', { query, count, offset, categoryIds, hasNone });
  try {
    const keywords = query.toLowerCase().split(" ");
    const likeClauses = keywords.map(keyword => ({
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ],
    }));

    const findOptions = {
      // DEBUG: Log likeClauses for keyword search
      // (log after construction below)

      where: { [Op.or]: likeClauses },
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}')`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.REPORT}')`), 'reportCount'],
        ],
      },
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: Category, as: "Categories", attributes: [], through: { attributes: [] }, required: false },
        { model: Attachment, as: 'attachment', attributes: ['id', 'file_name', 'mime_type'], required: false },
        { model: Comment, as: 'comments', attributes: ['id'], required: false },
      ],
      order: [["created_at", "DESC"]],
      distinct: true,
      limit: count,
      offset: offset,
    };

    // DEBUG: Log findOptions before category/none logic
    console.log('findOptions before category/none logic:', JSON.stringify(findOptions, null, 2));

    const categoryInclude = findOptions.include.find(i => i.as === 'Categories');

    // If hasNone is true, return questions with no categories
    if (hasNone) {
      findOptions.where = {
        ...findOptions.where,
        [Op.and]: Sequelize.where(
          Sequelize.literal(`NOT EXISTS (
            SELECT 1 FROM QuestionCategories qc
            WHERE qc.question_id = Question.id
          )`),
          true
        )
      };
    } else if (categoryIds.length > 0) {
      // If categoryIds has values, filter by those categories
      categoryInclude.where = { id: { [Op.in]: categoryIds } };
      categoryInclude.required = true;
    }
    // If hasNone is false and categoryIds is empty, return all (no category filter)


    // DEBUG: Log findOptions before query
    console.log('findOptions before findAndCountAll:', JSON.stringify(findOptions, null, 2));
    // DEBUG: Enable SQL logging for this query
    findOptions.logging = console.log;
    const { count: totalCount, rows: questions } = await Question.findAndCountAll(findOptions);
    // DEBUG: Log result count
    console.log('Query result:', { totalCount, questionsCount: questions.length });
    const nextOffset = offset + questions.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;
    logger.info(`Search results for questions with query: ${query}`);
    // Map to QuestionListItem shape expected by frontend
    const questionsList = questions.map(q => ({
      id: q.id,
      user: { username: q.user?.username },
      title: q.title,
      description: q.description,
      status: q.status,
      createdAt: q.created_at,
      isInterested: false, // Not available in search context
      interestId: null,    // Not available in search context
      hasLiked: false,     // Not available in search context
      likeCount: q.dataValues.likeCount ?? 0,
      commentCount: Array.isArray(q.comments) ? q.comments.length : 0,
    }));
    return {
      questions: questionsList,
      count: totalCount,
      offset: resOffset,
    };

  } catch (error) {
    // DEBUG: Log error with stack
    console.error('ERROR in searchQuestionByKeyword:', error);
    logEverything(error, "searchServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error searching for questions.");
  }
};

module.exports = {
  searchQuestionByKeyword,
};
