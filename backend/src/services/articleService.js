const Article = require("../models/article");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const logger = require("../utils/logger");
const db = require("../models/index");
const User = db.users;
const util = require("util");

const createArticle = async (userID, title, content) => {
  // Check if the user exists
  const user = await User.findByPk(userID);
  if (!user) {
    logger.warn(`failed to find user: ${userID}`);
    throw new HttpError(
      HttpStatusCodes.BAD_REQUEST,
      `user with id = ${userID} doesn't exist`
    );
  }

  // TODO: add permission check

  // Create the new article
  try {
    const article = await Article.create({
      title: title,
      content: content,
      author_id: userID,
    });

    logger.debug(`Article created: ${article.id}`);
    return article.id;
  } catch (error) {
    throw new HttpError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      `create article failed, err=${error}`
    );
  }
};

module.exports = {
  createArticle,
};
