// Tags related routes

const { body, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");
const tagController = require("../controllers/tagController");
const router = require("express").Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("name is required"),
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
  tagController.createTag
);

module.exports = router;
