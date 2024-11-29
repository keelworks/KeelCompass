// app.js

// Importing and initializing express app
const express = require("express");

// importing middlewares and utils
const morgan = require("morgan");
const logger = require("./utils/logger");
const { HttpStatusCodes } = require("./utils/httpError");

// Importing routes
const router = require("./routes/routes");

// Import Redis session configuration
const { redisSessionMiddleware } = require("./configs/redisConfig");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply the Redis session middleware
app.use(redisSessionMiddleware);

const cors = require("cors");
app.use(cors());

// Initializing app to use routes
// use morgan to log http requests
app.use(
  morgan("combined", {
    stream: {
      // redirect logs to winston log file
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use("/", router);

// For all other invalid routes
app.use("*", (req, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).send("Invalid route");
});

module.exports = app;
