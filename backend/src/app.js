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

// global error handler
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error:", err);

  // forbidden error
  if (err.status === 403 || err.statusCode === 403) {
    return res.status(403).json({
      status: 403,
      error: "Forbidden",
      message: err.message || "You do not have permission to access this resource."
    });
  }

  // not found error
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      status: 404,
      error: "Page Not Found",
      message: err.message || "The requested page does not exist."
    });
  }

  // internal server error
  res.status(500).json({
    status: 500,
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred."
  });
});

module.exports = app;
