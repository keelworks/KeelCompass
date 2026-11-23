const fs = require("fs");
const path = require("path");

// local-disk attachment storage. Works unchanged on a plain VM/Linode box
// (persistent filesystem) - the only thing that needs to persist it across
// container recreation is mounting this directory as a volume, which
// docker-compose.prod.yml already does. Swapping to S3/GCS later only means
// changing this module plus attachmentServices.js, nothing else.
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function resolveUploadPath(relativePath) {
  return path.join(UPLOAD_DIR, relativePath);
}

module.exports = { UPLOAD_DIR, resolveUploadPath };
