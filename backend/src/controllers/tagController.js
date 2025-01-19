const db = require("../models/index");
const Tag = db.tags;
const logger = require("../utils/logger");
const { HttpStatusCodes } = require("../utils/httpError");

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(HttpStatusCodes.CREATED).json(tag);
  } catch (error) {
    logger.error(`create tag failed, err=${error.message}`);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
