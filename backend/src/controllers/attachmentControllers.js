const logger = require("../utils/logger");
const db = require("../models");
const questionService = require("../services/questionServices");
const attachmentService = require("../services/attachmentServices");

// streams an attachment's bytes, but only after re-checking the same
// tag-based visibility rule that gates the owning question itself - the
// attachment id alone is not treated as a secret
const getAttachmentFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attachment = await db.Attachment.findByPk(id);
    if (!attachment) return res.status(404).json({ error: "Attachment not found" });

    let questionId = attachment.question_id;
    if (!questionId && attachment.comment_id) {
      const comment = await db.Comment.findByPk(attachment.comment_id, { attributes: ["question_id"] });
      questionId = comment?.question_id;
    }
    if (!questionId) return res.status(404).json({ error: "Attachment not found" });

    const viewerTag = req.user?.normalized_role_tag ?? null;
    const canView = await questionService.canUserViewQuestion(questionId, req.user.id, viewerTag);
    if (!canView) return res.status(404).json({ error: "Attachment not found" });

    res.setHeader("Content-Type", attachment.mime_type);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(attachment.file_name || "attachment")}"`
    );

    const filePath = attachmentService.getAttachmentFilePath(attachment);
    if (filePath) return res.sendFile(filePath);

    // legacy rows that haven't been backfilled onto disk yet
    if (attachment.data) return res.end(attachment.data);

    return res.status(404).json({ error: "Attachment file is missing" });
  } catch (error) {
    logger.error(`Caught in getAttachmentFile controller: ${error.message}`);
    next(error);
  }
};

module.exports = { getAttachmentFile };
