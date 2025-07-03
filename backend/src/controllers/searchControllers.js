const logger = require("../utils/logger");

const searchService = require("../services/searchServices");

// search questions by keyword
const searchQuestionByKeyword = async (req, res, next) => {
  try {
    const { query, count, offset, categoriesIds, hasNone } = req.body;

    const parsedCategoryIds = Array.isArray(categoriesIds)
    ? categoriesIds.map(id => parseInt(id, 10)).filter(Number.isInteger)
    : [];

    const result = await searchService.searchQuestionByKeyword(query, count, offset, parsedCategoryIds, !!hasNone);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in searchQuestionByKeyword controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  searchQuestionByKeyword,
};
