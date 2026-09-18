const express = require("express");
const morgan = require("morgan");
const logger = require("./utils/logger");
const router = require("./routes/routes");

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

// 503 maintenance mode
if (process.env.MAINTENANCE_MODE === "true") {
  app.use((_req, res) => {
    res.status(503).json({
      status: 503,
      error: "Maintenance",
      message: "The system is undergoing scheduled maintenance. Please try again later."
    });
  });
}

// 404 handler
app.use((_req, _res, next) => {
  const notFoundError = {
    status: 404,
    message: "The requested page does not exist.",
  };
  next(notFoundError);
});

// error status text for known HTTP status codes thrown via HttpError
const ERROR_STATUS_TEXT = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  410: "Gone",
  429: "Too Many Requests",
};

// global error handler
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error:", err);

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    error: ERROR_STATUS_TEXT[statusCode] || "Internal Server Error",
    message: err.message || "An unexpected error occurred."
  });
});

module.exports = app;
