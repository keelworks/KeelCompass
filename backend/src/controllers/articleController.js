const articleService = require("../services/articleService");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const logger = require("../utils/logger");
const db = require("../models/index");
const util = require("util");
const Article = db.articles;
const Tag = db.tags;

module.exports = {
  createArticle: async (req, res) => {
    try {
      logger.debug(`create article request, body = ${util.inspect(req.body)}`);
      const { authorID, title, content, tags } = req.body;

      const articleID = await articleService.createArticle(
        authorID,
        title,
        content,
        tags
      );

      res.status(HttpStatusCodes.CREATED).json({
        message: "Article created successfully",
        articleID: articleID,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Server Error" });
      }
    }
  },

  getArticlesByTag: async (req, res) => {
    logger.debug(
      `get articles by tag request, params = ${util.inspect(req.params)}`
    );

    const { tagName } = req.params;
    try {
      // TODO: permission check
      const articles = await Article.findAll({
        include: [
          {
            model: Tag,
            where: { name: tagName },
            through: { attributes: [] },
          },
        ],
      });

      res.status(HttpStatusCodes.OK).json({ articles: articles });
    } catch (error) {
      logger.error(
        `get article by tag failed, tag=${tagName}, error=${error.message}`
      );
      res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  getArticleByID: async (req, res) => {
    logger.debug(
      `get articles by ID request, params = ${util.inspect(req.params)}`
    );

    const { articleID } = req.params;

    try {
      const article = await articleService.getArticleByID(articleID);

      res.status(HttpStatusCodes.OK).json({ article: article });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Server Error" });
      }
    }
  },

  updateArticle: async (req, res) => {
    logger.debug(`update article request, body = ${util.inspect(req.body)}`);
    const { articleID, title, content, tags } = req.body;

    try {
      await articleService.updateArticle(articleID, title, content, tags);

      res.status(HttpStatusCodes.OK).json({
        message: "Article updated successfully",
      });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Server Error" });
      }
    }
  },
};
