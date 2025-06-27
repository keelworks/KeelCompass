const db = require("../models");
const logger = require("../utils/logger");
const { HttpError } = require("../utils/httpError");

const Attachment = db.attachment;

// get attachment by question id or comment id
const getAttachmentByOwner = async (owner) => {
  try {
    const { question_id, comment_id } = owner;
    if (!question_id && !comment_id) {
      throw new HttpError(400, "Owner ID (question_id or comment_id) must be provided");
    }

    const where = question_id ? { question_id } : { comment_id };
    const attachment = await Attachment.findOne({ where });
    logger.info(`Found attachment ${attachment.id} for question ${question_id} or comment ${comment_id}`);
    return attachment;
  } catch (error) {
    logger.error(`Error finding attachment by owner: ${error.message}`);
    throw error;
  }
};

// create attachment
const createAttachment = async (file, owner) => {
  try {
    const { question_id, comment_id } = owner;
    if (!question_id && !comment_id) {
      throw new HttpError(400, "Attachment must be linked to a question or a comment");
    }
    const existingAttachment = await getAttachmentByOwner({ question_id, comment_id });
    if (existingAttachment) {
      throw new HttpError(409, "An attachment already exists for this question or comment");
    }

    const { originalname, mimetype, buffer } = file;
    const attachment = await Attachment.create({
      file_name: originalname,
      mime_type: mimetype,
      data: buffer,
      question_id: question_id || null,
      comment_id: comment_id || null,
    });
    logger.info(`Created attachment ${attachment.id} for question ${question_id} or comment ${comment_id}`);
    return attachment;
  } catch (error) {
    logger.error(`Error creating attachment: ${error.message}`);
    throw error;
  }
};

// delete attachment by id
const deleteAttachment = async (id) => {
  try {
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
      throw new HttpError(404, "Attachment not found");
    }

    await attachment.destroy();
    logger.info(`Attachment with id ${id} deleted successfully`);
    return { message: "Attachment deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting attachment with id ${id}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getAttachmentByOwner,
  createAttachment,
  deleteAttachment,
};
