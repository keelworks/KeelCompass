const db = require("../models");
const ActionTypes = require("../constants/actionTypes");
const Sequelize = db.sequelize;

const searchQuestionByKeyword = async (query, count, offset, categoryIds = [], hasNone = false) => {
  const keywords = query.toLowerCase().split(" ");
  const replacements = {
    likeAction: ActionTypes.LIKE,
    reportAction: ActionTypes.REPORT,
    limit: count,
    offset: offset,
  };

  const likeClauses = keywords.map((_, i) =>
    `(LOWER(Questions.title) LIKE :kw${i} OR LOWER(Questions.description) LIKE :kw${i})`
  );
  keywords.forEach((word, i) => {
    replacements[`kw${i}`] = `%${word}%`;
  });

  let whereClause = likeClauses.join(" OR ");

  if (categoryIds.length > 0 && hasNone) {
    whereClause = `(${whereClause}) AND (
      QuestionCategories.category_id IN (:categoryIds)
      OR QuestionCategories.category_id IS NULL
    )`;
    replacements.categoryIds = categoryIds;
  } else if (categoryIds.length > 0) {
    whereClause = `(${whereClause}) AND QuestionCategories.category_id IN (:categoryIds)`;
    replacements.categoryIds = categoryIds;
  } else if (hasNone) {
    whereClause = `(${whereClause}) AND QuestionCategories.category_id IS NULL`;
  }

  const baseSelect = `
    SELECT 
      DISTINCT Questions.id,
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
    LEFT JOIN QuestionCategories ON Questions.id = QuestionCategories.question_id
  `;

  const finalQuery = `
    ${baseSelect}
    WHERE ${whereClause}
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
    SELECT COUNT(DISTINCT Questions.id) as total
    FROM Questions
    LEFT JOIN QuestionCategories ON Questions.id = QuestionCategories.question_id
    WHERE ${whereClause}
  `;

  const [totalResult] = await Sequelize.query(totalQuery, {
    replacements,
    type: Sequelize.QueryTypes.SELECT,
  });

  const totalCount = totalResult.total || 0;
  let resOffset = offset + questions.length;
  if (resOffset >= totalCount) resOffset = -1;

  return [questions, resOffset, totalCount];
};

module.exports = {
  searchQuestionByKeyword,
};
