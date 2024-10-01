//importing and initializing express app
const express = require("express");

//importing routes
const router = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

//initializing app to use routes
app.use("/", router);

//for all other invalid routes
app.use("*", (req, res) => {
  res.status(400).send("Invalid route");
});

module.exports = app;
