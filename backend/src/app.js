// importing and initializing express app
const express = require("express");

// importing middlewares and utils
const morgan = require("morgan");
const logger = require("./utils/logger");
const HttpStatusCodes = require("./utils/httpError");

// importing routes
const router = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// use morgan to log http requests
app.use(
  morgan("combined", {
    stream: {
      // redirect logs to winston log file
      write: (message) => logger.info(message.trim()),
    },
  })
);

//initializing app to use routes
app.use("/", router);

//for all other invalid routes
app.use("*", (req, res) => {
  res.status(HttpStatusCodes.BAD_REQUEST).send("Invalid route");
});

module.exports = app;
