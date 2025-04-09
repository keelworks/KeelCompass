const logger = require("../utils/logger");
const { HttpStatusCodes } = require("../utils/httpError");
const uploadService = require("../services/uploadService");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      logger.warn("No file uploaded or file too large");
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: "No file uploaded or file too large" });
    }

    const fileUrl = await uploadService.uploadFile(req.file);
    res.json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    logger.error("Upload error:", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to upload file" });
  }
};
