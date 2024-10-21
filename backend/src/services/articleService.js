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

const getArticleByID = async (articleID) => {
  // TODO: permission check

  try {
    const article = await Article.findOne({
      where: {
        id: articleID,
      },
    });

    if (!article) {
      throw new HttpError(
        HttpStatusCodes.NOT_FOUND,
        `article with id=${article} doesn't exist`
      );
    } else {
      return article;
    }
  } catch (error) {
    logger.error(`get article by ID =${articleID} failed, err=${error}`);
  }
};

const updateArticle = async (articleID, title, content, tags) => {
  // Check if the article exists
  const article = await Article.findOne({
    where: {
      id: articleID,
    },
  });
  if (!article) {
    logger.warn(`failed to find article: ${articleID}`);
    throw new HttpError(
      HttpStatusCodes.BAD_REQUEST,
      `article with id = ${articleID} doesn't exist`
    );
  }

  // TODO: add permission check

  // Update the article
  try {
    await article.update({
      title: title,
      content: content,
    });

    // Associate tags with the article
    if (tags && tags.length > 0) {
      await article.setTags(tags);
    }

    return article.id;
  } catch (error) {
    logger.error(`update article failed, err=${error}`);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new HttpError(
        HttpStatusCodes.BAD_REQUEST,
        `failed to add tags to the article`
      );
    }

    throw new HttpError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      `update article failed, err=${error}`
    );
  }
};

module.exports = {
  createArticle,
  getArticleByID,
  updateArticle,
};
