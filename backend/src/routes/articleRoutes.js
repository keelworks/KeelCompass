// Article related routes

const articleController = require("../controllers/articleController");
const { body, param, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const router = require("express").Router();

router.post(
  "/",
  [
    body("authorID")
      .notEmpty()
      .withMessage("author ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid author ID"),
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .bail()
      .isString()
      .withMessage("invalid title"),
    body("content")
      .notEmpty()
      .withMessage("content is required")
      .bail()
      .isString()
      .withMessage("invalid content"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .bail()
      .custom((value) => value.every(Number.isInteger))
      .withMessage("invalid tags"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      next();
    },
  ],
  articleController.createArticle
);

router.get("/tag/:tagName", articleController.getArticlesByTag);

router.get(
  "/id/:articleID",
  [
    param("articleID").isInt({ gt: 0 }).withMessage("invalid ID"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      next();
    },
  ],
  articleController.getArticleByID
);

router.put(
  "/",
  [
    body("articleID")
      .notEmpty()
      .withMessage("article ID is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("invalid ID"),
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .bail()
      .isString()
      .withMessage("invalid title"),
    body("content")
      .notEmpty()
      .withMessage("content is required")
      .bail()
      .isString()
      .withMessage("invalid content"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array")
      .bail()
      .custom((value) => value.every(Number.isInteger))
      .withMessage("invalid tags"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg)
          .join(", ");
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: errorMessages });
      }
      next();
    },
  ],
  articleController.updateArticle
);

module.exports = router;
