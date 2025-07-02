const { logEverything } = require("../utils/logger");
const { HttpError } = require("../utils/errors");
const { Category } = require("../models/Category");

// get all categories
const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({ attributes: ["id", "name"] });
    return categories;
  } catch (error) {
    logEverything(error, "categoryServices");
    throw new HttpError(500, "Error fetching categories");
  }
};

module.exports = { getAllCategories };
