const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Attachment = db.Attachment;

// get attachment by question id or comment id
const getAttachmentByOwner = async (owner) => {
  try {
    const { question_id, comment_id } = owner;
    const where = question_id ? { question_id } : { comment_id };
    const attachment = await Attachment.findOne({ where });
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
    const { question_id, comment_id } = owner;
    if (!question_id && !comment_id) throw new HttpError(400, "Attachment must be linked to a question or a comment");
    const existingAttachment = await getAttachmentByOwner({ question_id, comment_id });
    if (existingAttachment) throw new HttpError(409, "Attachment already exists for this question or comment");

    const { originalname, mimetype, buffer } = file;
    const attachment = await Attachment.create({
      file_name: originalname,
      mime_type: mimetype,
      data: buffer,
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

    await attachment.destroy();
    logger.info(`Attachment ${id} deleted successfully`);
    return id;
  } catch (error) {
    logEverything(error, "attachmentServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting attachment");
  }
};

module.exports = {
  getAttachmentByOwner,
  createAttachment,
  deleteAttachment,
};
