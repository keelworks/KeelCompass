// require("dotenv").config();
// const { Storage } = require("@google-cloud/storage");
// const logger = require("../utils/logger");

// const storage = new Storage();
// const bucketName = process.env.GCS_BUCKET_NAME;
// const bucket = storage.bucket(bucketName);

// async function testGCSConnection(bucketName) {
//   try {
//     const [metadata] = await storage.bucket(bucketName).getMetadata();
//     logger.info(`✅ Successfully connected to bucket: ${metadata.name}`);
//     return true;
//   } catch (error) {
//     logger.error("❌ Failed to connect to Google Cloud Storage:", error.message);
//     return false;
//   }
// }

// async function uploadFile(file) {
//   const gcsFileName = `${Date.now()}-${file.originalname}`;
//   const gcsFile = bucket.file(gcsFileName);

//   await gcsFile.save(file.buffer, {
//     metadata: { contentType: file.mimetype },
//   });

//   return `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
// }

// testGCSConnection(bucketName);

// module.exports = { storage, uploadFile };
