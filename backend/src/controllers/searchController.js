const searchService = require("../services/searchService");
const logger = require("../utils/logger");
const { ServiceErrorHandler } = require("../utils/httpError");


// search questions by keyword
const searchQuestionByKeyword = async (req, res) => {
    const { query = '', count = 10, offset = 0 } = req.query;
  
    if (!query.trim()) {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }
  
    searchService
      .searchQuestionByKeyword(query.trim(), Number(count), Number(offset))
      .then(([questions, offset, total]) => {
        return res.status(200).json({
          message: "success",
          questions,
          offset,
          total,
        });
      })
      .catch((error) => ServiceErrorHandler(error, res, logger, "searchQuestions"));
  };
  
  module.exports = {
    searchQuestionByKeyword,
  };
  