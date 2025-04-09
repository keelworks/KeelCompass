const express = require("express");
const morgan = require("morgan");
const logger = require("./utils/logger");
const router = require("./routes/routes");
const { HttpStatusCodes } = require("./utils/httpError");

// initialize express app
const app = express();

// parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// check request format
app.use((err, _, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// initialize cors configuration
const cors = require("cors");
app.use(cors());

// initialize app to use morgan to log http requests
app.use(
  morgan("combined", {
    stream: {
      // redirect logs to winston log file
      write: (message) => logger.info(message.trim()),
    },
  })
);

// initialize all routes
app.use("/", router);

// fallback route
app.use("*", (_, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).send("Invalid route");
});

module.exports = app;
