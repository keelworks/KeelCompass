const { getAllCategories } = require("../services/categoryServices");

const getCategories = async (_, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Caught in getCategories controller: ${error.message}`);
    next(error);
  }
};

module.exports = { getCategories };
