// Determine environment mode (set via npm script or Docker Compose)
const env = process.env.NODE_ENV || "development";

// Load environment variables only in development
if (env === "development") {
  require("dotenv").config({ path: ".env" });
}

const app = require("./src/app.js");
const logger = require("./src/utils/logger");
const port = process.env.PORT || 8080;

// server listening on port <PORT> for incoming requests
app.listen(port, () => {
  logger.info(
    `Server is running on port ${port}, env = ${env}, logging level = ${logger.level}`
  );
});
