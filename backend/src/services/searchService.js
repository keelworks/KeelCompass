const db = require("../models");
const ActionTypes = require("../constants/actionTypes")
const Sequelize = db.sequelize;


const searchQuestionByKeyword = async (query, count, offset) => {
    const isShort = query.length < 4;
  
    const baseSelect = `
      SELECT 
        Questions.id,
        Questions.title,
        Questions.description,
        Questions.attachment,
        Questions.created_at,
        (
          SELECT JSON_OBJECT('id', Users.id, 'username', Users.username)
          FROM Users
          WHERE Users.id = Questions.user_id
          LIMIT 1
        ) AS user,
        (
          SELECT COUNT(*)
          FROM UserQuestionActions
          WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :likeAction
        ) AS likeCount,
        (
          SELECT COUNT(*)
          FROM UserQuestionActions
          WHERE UserQuestionActions.question_id = Questions.id AND UserQuestionActions.action_type = :reportAction
        ) AS reportCount
      FROM Questions
    `;
  
    let whereClause;
    let replacements = {
      likeAction: ActionTypes.LIKE,
      reportAction: ActionTypes.REPORT,
      limit: count,
      offset: offset,
    };
  
    if (isShort) {
      whereClause = `WHERE LOWER(Questions.title) LIKE :search OR LOWER(Questions.description) LIKE :search`;
      replacements.search = `%${query.toLowerCase()}%`;
    } else {
      whereClause = `WHERE MATCH(Questions.title, Questions.description) AGAINST (:matchQuery IN NATURAL LANGUAGE MODE)`;
      replacements.matchQuery = query;
    }
  
    const finalQuery = `
      ${baseSelect}
      ${whereClause}
      ORDER BY Questions.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
  
    const questions = await Sequelize.query(finalQuery, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });
  
    questions.forEach((row) => {
      row.attachment = row.attachment ?? [];
    });
  
    const totalQuery = `
      SELECT COUNT(*) as total
      FROM Questions
      ${whereClause}
    `;
    const [totalResult] = await Sequelize.query(totalQuery, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });
    const totalCount = totalResult.total || 0;
  
    let resOffset = offset + questions.length;
    if (resOffset >= totalCount) {
      resOffset = -1;
    }
  
    return [questions, resOffset, totalCount];
  };
  
  module.exports = {
    searchQuestionByKeyword,
  };
  