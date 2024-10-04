// Article related routes

const articleController = require("../controllers/articleController");
const { body, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const router = require("express").Router();

router.post(
  "/create",
  [
    body("authorID")
      .notEmpty()
      .withMessage("author ID is required")
      .isInt()
      .withMessage("invalid author ID"),
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isString()
      .withMessage("invalid title"),
    body("content")
      .notEmpty()
      .withMessage("content is required")
      .isString()
      .withMessage("invalid content"),
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

module.exports = router;
