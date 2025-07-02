const logger = require("../utils/logger");

const searchService = require("../services/searchServices");

// search questions by keyword
const searchQuestionByKeyword = async (req, res, next) => {
  try {
    const { query, count, offset, categoriesIds, hasNone } = req.query;

    let parsedCategoryIds = [];
    if (categoriesIds) {
      if (Array.isArray(categoriesIds)) {
        parsedCategoryIds = categoriesIds.map(id => parseInt(id, 10)).filter(Number.isInteger);
      } else if (typeof categoriesIds === 'string') {
        parsedCategoryIds = categoriesIds.split(',').map(id => parseInt(id.trim(), 10)).filter(Number.isInteger);
      }
    }

    const [questions, totalCount, resOffset] = await searchService.searchQuestionByKeyword(query, count, offset, parsedCategoryIds, hasNone);
    return res.status(200).json({ questions, totalCount, resOffset });
  } catch (error) {
    logger.error(`Caught in searchQuestionByKeyword controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  searchQuestionByKeyword,
};
