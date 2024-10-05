// Article related routes

const articleController = require("../controllers/articleController");
const { body, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const router = require("express").Router();

router.post(
  "/create",
  [
    body("authorID")
      .notEmpty().withMessage("author ID is required")
      .bail()
      .isInt().withMessage("invalid author ID"),
    body("title")
      .notEmpty().withMessage("title is required")
      .bail()
      .isString().withMessage("invalid title"),
    body("content")
      .notEmpty().withMessage("content is required")
      .bail()
      .isString()
      .withMessage("invalid content"),
    body("tags")
      .optional()
      .isArray({ min: 1 }).withMessage('Tags must be an array')
      .bail()
      .custom((value) => value.every(Number.isInteger)).withMessage('invalid tags'),
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

router.get('/tag/:tagName', articleController.getArticlesByTag);

module.exports = router;
