// require("dotenv").config();
// const router = require("express").Router();
// const multer = require("multer");
// const uploadController = require("../controllers/uploadController");
// const authenticator = require("../middlewares/authMiddleware");
// const { HttpStatusCodes } = require("../utils/httpError");

// const upload = multer({
//   limits: {
//     fileSize: process.env.FILE_SIZE_LIMIT * 1024 * 1024,
//     files: 1,
//   },
//   storage: multer.memoryStorage(),
// });

// const multerErrorHandler = (err, _, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ error: `File size exceeds ${process.env.FILE_SIZE_LIMIT}MB limit` });
//     } else if (err.code === "LIMIT_FILE_COUNT") {
//       return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: `Only one file allowed` });
//     }
//     return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
//   }
//   next(err);
// };

// router.post("/", upload.single("file"), authenticator, uploadController.uploadFile, multerErrorHandler);

// module.exports = router;
