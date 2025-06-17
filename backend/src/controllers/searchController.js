const searchService = require("../services/searchService");
const logger = require("../utils/logger");
const { ServiceErrorHandler } = require("../utils/httpError");

const searchQuestionByKeyword = async (req, res) => {
  try {
    const { query = '', count = 10, offset = 0, categories = '' } = req.query;

    if (!query.trim()) {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }

    const rawCategories = categories ? categories.split(',') : [];
    const hasNone = rawCategories.includes('none');
    const categoryIds = rawCategories
      .filter(id => id !== 'none')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    const [questions, resOffset, total] = await searchService.searchQuestionByKeyword(query.trim(), Number(count), Number(offset), categoryIds, hasNone);

    return res.status(200).json({
      message: "success",
      questions,
      offset: resOffset,
      total,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "searchQuestions");
  }
};

module.exports = {
  searchQuestionByKeyword,
};
