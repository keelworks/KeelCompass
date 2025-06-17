const db = require("../models");
const logger = require("../utils/logger");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const Attachment = db.attachments;

// post attachment
const createAttachment = async (file, owner) => {
  try {
    const { originalname, mimetype, buffer } = file;
    const { question_id, comment_id } = owner;

    if (!question_id && !comment_id) {
      throw new HttpError(HttpStatusCodes.BAD_REQUEST, "Attachment must be linked to a question or a comment.");
    }

    const existingAttachment = await getAttachmentByOwner({ question_id, comment_id });
    if (existingAttachment) {
      throw new HttpError(HttpStatusCodes.CONFLICT, "An attachment already exists for this question or comment.");
    }

    logger.info(`Creating attachment ${originalname} for question ${question_id} or comment ${comment_id}`);
    const attachment = await Attachment.create({
      file_name: originalname,
      mime_type: mimetype,
      data: buffer,
      question_id: question_id || null,
      comment_id: comment_id || null,
    });
    return attachment;
  } catch (error) {
    logger.error(`Error creating attachment: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error creating attachment.");
  }
};

// get attachment by question id or comment id
const getAttachmentByOwner = async (owner) => {
  try {
    const { question_id, comment_id } = owner;

    if (!question_id && !comment_id) {
      throw new HttpError(HttpStatusCodes.BAD_REQUEST, "Owner ID (question_id or comment_id) must be provided.");
    }

    const where = question_id ? { question_id } : { comment_id };

    logger.info(`Finding attachment for owner: ${JSON.stringify(owner)}`);
    const attachment = await Attachment.findOne({ where });
    return attachment;
  } catch (error) {
    logger.error(`Error finding attachment by owner: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error finding attachment.");
  }
};

// delete attachment by id
const deleteAttachment = async (id) => {
  try {
    logger.info(`Deleting attachment with id ${id}`);
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "Attachment not found.");
    }
    await attachment.destroy();
    return { message: "Attachment deleted successfully." };
  } catch (error) {
    logger.error(`Error deleting attachment with id ${id}: ${error.message}`);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Error deleting attachment.");
  }
};



module.exports = {
  createAttachment,
  getAttachmentByOwner,
  deleteAttachment,
};
