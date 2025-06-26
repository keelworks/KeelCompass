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

// Maintenance mode middleware (MUST be before all routes)
if (process.env.MAINTENANCE_MODE === "true") {
  app.use((_req, res) => {
    res.status(503).json({
      status: 503,
      error: "Maintenance",
      message: "The system is undergoing scheduled maintenance. Please try again later."
    });
  });
}

// fallback 404 route (after all routes)
app.use("*", (_req, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).json({
    status: 404,
    error: "Page Not Found",
    message: "The requested page does not exist."
  });
});

// global error handler (must be last)
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error:", err);

  // Forbidden error
  if (err.status === HttpStatusCodes.FORBIDDEN || err.statusCode === HttpStatusCodes.FORBIDDEN) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      status: 403,
      error: "Forbidden",
      message: err.message || "You do not have permission to access this resource."
    });
  }

  // Not Found error
  if (err.status === HttpStatusCodes.NOT_FOUND || err.statusCode === HttpStatusCodes.NOT_FOUND) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      status: 404,
      error: "Page Not Found",
      message: err.message || "The requested page does not exist."
    });
  }

  // Internal Server Error (default)
  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 500,
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred."
  });
});

module.exports = app;
