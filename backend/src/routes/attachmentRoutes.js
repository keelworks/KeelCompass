const express = require("express");
const isUser = require("../middlewares/isUser");
const { getAttachmentFile } = require("../controllers/attachmentControllers");

const router = express.Router();
router.use(isUser);

router.get("/:id/file", getAttachmentFile);

module.exports = router;
