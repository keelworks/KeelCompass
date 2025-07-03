const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Category = db.Category;

// get all categories
const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({ attributes: ["id", "name"] });
    logger.info(`Fetched categories successfully`);
    return categories;
  } catch (error) {
    logEverything(error, "categoryServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching categories");
  }
};

module.exports = { getAllCategories };
