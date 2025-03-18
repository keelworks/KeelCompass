require("dotenv").config();
const multer = require("multer");
const router = require("express").Router();
const uploadController = require("../controllers/uploadController");
const { HttpStatusCodes } = require("../utils/httpError");
const authenticator = require("../middlewares/authMiddleware");

const upload = multer({
  limits: {
    fileSize: process.env.FILE_SIZE_LIMIT * 1024 * 1024, // Limit file size
    files: 1, // Limit file count
  },
  storage: multer.memoryStorage(),
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: `File size exceeds ${process.env.FILE_SIZE_LIMIT}MB limit` });
    } else if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: `Only one file allowed` });
    }
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
  }
  next(err);
};

router.post("/", upload.single("file"), authenticator, uploadController.uploadFile, multerErrorHandler);

module.exports = router;
