const fs = require("fs");
const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { resolveUploadPath } = require("../utils/uploadPaths");

const db = require("../models");
const Attachment = db.Attachment;

// get attachment by question id or comment id
const getAttachmentByOwner = async (owner) => {
  try {
    const { question_id, comment_id } = owner;
    const where = question_id ? { question_id } : { comment_id };
    const attachment = await Attachment.findOne({ where });
    if (!attachment) {
      logger.info(`No attachment found for question ${question_id} or comment ${comment_id}`);
      return null;
    }
    logger.info(`Fetched attachment ${attachment.id} for question ${question_id} or comment ${comment_id}`);
    return attachment.id;
  } catch (error) {
    logEverything(error, "attachmentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error fetching attachment");
  }
};

// create attachment
const createAttachment = async (file, owner) => {
  try {
    // Only allow image and PDF mimetypes
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml',
      'image/tiff',
      'image/x-icon',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpError(400, 'Only image and PDF files are allowed as attachments.');
    }
    const { question_id, comment_id } = owner;
    if (!question_id && !comment_id) throw new HttpError(400, "Attachment must be linked to a question or a comment");
    const existingAttachment = await getAttachmentByOwner({ question_id, comment_id });
    if (existingAttachment) throw new HttpError(409, "Attachment already exists for this question or comment");

    // multer's diskStorage has already written the bytes to UPLOAD_DIR under
    // file.filename by the time we get here - this just records where
    const { originalname, mimetype, filename } = file;
    const attachment = await Attachment.create({
      file_name: originalname,
      mime_type: mimetype,
      file_path: filename,
      question_id: question_id || null,
      comment_id: comment_id || null,
    });
    logger.info(`Created attachment ${attachment.id} for question ${question_id} or comment ${comment_id}`);
    return attachment.id;
  } catch (error) {
    logEverything(error, "attachmentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error creating attachment");
  }
};

// delete attachment by id
const deleteAttachment = async (id) => {
  try {
    const attachment = await Attachment.findByPk(id);
    if (!attachment) throw new HttpError(404, "Attachment not found");

    if (attachment.file_path) {
      fs.unlink(resolveUploadPath(attachment.file_path), (err) => {
        if (err && err.code !== "ENOENT") {
          logger.error(`Failed to remove attachment file ${attachment.file_path}: ${err.message}`);
        }
      });
    }
    await attachment.destroy();
    logger.info(`Attachment ${id} deleted successfully`);
    return id;
  } catch (error) {
    logEverything(error, "attachmentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting attachment");
  }
};

// resolves an attachment to an absolute, readable path on disk - callers
// (the file-serving controller) must do their own visibility check first,
// this just answers "where does it live"
const getAttachmentFilePath = (attachment) => {
  if (!attachment.file_path) return null;
  const absolutePath = resolveUploadPath(attachment.file_path);
  return fs.existsSync(absolutePath) ? absolutePath : null;
};

module.exports = {
  getAttachmentByOwner,
  createAttachment,
  deleteAttachment,
  getAttachmentFilePath,
};
