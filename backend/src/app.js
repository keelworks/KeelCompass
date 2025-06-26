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

// root welcome route
app.get("/", (_, res) => {
  res.status(200).send("Welcome to the KeelCompass backend");
});

// fallback route
app.use("*", (_, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).send("Invalid route");
});

// global error handler (must be last)
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error:", err);
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
