const { createLogger, format, transports } = require("winston");
const path = require("path");

// default log file path fallback if not set
const logFilePath = process.env.LOG_PATH || path.join(__dirname, "../../logs/app.log");

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: logFilePath }),
  ],
});

// add console logging if not production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    })
  );
}

module.exports = logger;
