//using dotenv for accessing environment variables
require("dotenv").config();

const app = require("./src/app.js");
const logger = require("./src/utils/logger");

const PORT = `${process.env.PORT}`;
const ENV = `${process.env.NODE_ENV}`;

//server listening on port <PORT> for incoming requests
app.listen(PORT, () => {
  logger.info(
    `Server is running on port ${PORT}, env = ${ENV}, logging level = ${logger.level}`
  );
});
