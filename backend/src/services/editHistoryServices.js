const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const EditHistory = db.EditHistory;

// snapshots the version about to be overwritten - call this with the
// pre-update values, before saving the new ones
const recordEdit = async (entityType, entityId, previousTitle, previousContent) => {
  try {
    await EditHistory.create({
      entity_type: entityType,
      entity_id: entityId,
      previous_title: previousTitle ?? null,
      previous_content: previousContent,
    });
  } catch (error) {
    // a logging failure shouldn't block the edit it's recording
    logger.error(`Failed to record edit history for ${entityType} ${entityId}: ${error.message}`);
  }
};

const getEditHistory = async (entityType, entityId) => {
  try {
    const entries = await EditHistory.findAll({
      where: { entity_type: entityType, entity_id: entityId },
      order: [["edited_at", "DESC"]],
    });
    return entries.map((e) => ({
      id: e.id,
      previousTitle: e.previous_title,
      previousContent: e.previous_content,
      editedAt: e.edited_at,
    }));
  } catch (error) {
    logEverything(error, "editHistoryServices");
    throw new HttpError(500, "Error retrieving edit history");
  }
};

module.exports = { recordEdit, getEditHistory };
