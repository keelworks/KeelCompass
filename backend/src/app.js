// app.js

// Importing and initializing express app
const express = require("express");

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
app.use("/", router);

// For all other invalid routes
app.use("*", (req, res) => {
  res.status(400).send("Invalid route");
});

module.exports = app;
