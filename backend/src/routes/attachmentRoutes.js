const express = require("express");
const { param } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const { getAttachmentFile } = require("../controllers/attachmentControllers");

const router = express.Router();
router.use(isUser);

const getAttachmentFileValidation = [
  param("id").notEmpty().withMessage("Attachment ID is required.").bail().isInt({ gt: 0 }).withMessage("Invalid attachment ID."),
  handleValidationErrors,
];

router.get("/:id/file", getAttachmentFileValidation, getAttachmentFile);

module.exports = router;
