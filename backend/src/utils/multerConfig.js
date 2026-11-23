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
// mirrors the frontend's accept="image/*,application/pdf" file picker hint -
// that attribute is only a UI filter, so the server has to enforce it too,
// since a direct API request can send any content-type regardless of what
// the browser's file picker was restricted to
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }
  const err = new Error("Only image and PDF attachments are allowed.");
  err.statusCode = 400;
  cb(err);
};

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter }); // 10MB max

module.exports = upload;
