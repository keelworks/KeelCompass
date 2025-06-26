const { Op } = require("sequelize");
const db = require("../models");
const ActionTypes = require("../constants/actionTypes");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const Sequelize = db.sequelize;
const Question = db.questions;
const User = db.users;
const Category = db.categories;
const Attachment = db.attachments;

const searchQuestionByKeyword = async (query, count, offset, categoryIds = [], hasNone = false) => {
  try {
    logger.info(`Searching for questions with query: ${query}`);
    const keywords = query.toLowerCase().split(" ");
    const likeClauses = keywords.map(keyword => ({
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ],
    }));

    const findOptions = {
      where: { [Op.or]: likeClauses },
      attributes: {
        include: [
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.LIKE}')`), 'likeCount'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM UserQuestionActions WHERE UserQuestionActions.question_id = Question.id AND UserQuestionActions.action_type = '${ActionTypes.REPORT}')`), 'reportCount'],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: Category,
          as: "Categories",
          attributes: [],
          through: { attributes: [] },
          required: false, // Default to LEFT JOIN
        },
        {
            model: Attachment,
            as: 'attachment',
            attributes: ['id', 'file_name', 'mime_type'],
            required: false,
        }
      ],
      order: [["created_at", "DESC"]],
      distinct: true,
      limit: count,
      offset: offset,
    };

    const categoryInclude = findOptions.include.find(i => i.as === 'Categories');

    if (categoryIds.length > 0 && hasNone) {
      findOptions.where = {
        [Op.and]: [
          findOptions.where,
          {
            [Op.or]: [
              { '$Categories.id$': { [Op.in]: categoryIds } },
              { '$Categories.id$': null },
            ],
          },
        ],
      };
      findOptions.subQuery = false; 
    } else if (categoryIds.length > 0) {
      categoryInclude.where = { id: { [Op.in]: categoryIds } };
      categoryInclude.required = true; 
    } else if (hasNone) {
      findOptions.where['$Categories.id$'] = null;
    }

    const { count: totalCount, rows: questions } = await Question.findAndCountAll(findOptions);

    const nextOffset = offset + questions.length;
    const resOffset = nextOffset >= totalCount ? -1 : nextOffset;

    return [questions, resOffset, totalCount];
  } catch (error) {
    logger.error(`Error searching for questions: ${error.message}`);
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error searching for questions.");
  }
};

module.exports = {
  searchQuestionByKeyword,
};
