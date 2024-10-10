const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const logger = require("../utils/logger");
const db = require("../models/index");
const User = db.users;
const Article = db.articles;
const util = require("util");

const createArticle = async (userID, title, content, tags) => {
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

    // Associate tags with the article
    if (tags && tags.length > 0) {
      await article.setTags(tags);
    }

    return article.id;
  } catch (error) {
    logger.error(`create article failed, err=${error}`);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new HttpError(
        HttpStatusCodes.BAD_REQUEST,
        `failed to add tags to the article`
      );
    }

    throw new HttpError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      `create article failed, err=${error}`
    );
  }
};

module.exports = {
  createArticle,
};
