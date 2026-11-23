const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { UPLOAD_DIR } = require("./uploadPaths");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  // random name on disk (never the user-supplied original name) - the real
  // file_name is kept separately in the Attachment row for display/download
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

module.exports = upload;
