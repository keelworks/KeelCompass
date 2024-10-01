// defining routes to route request calls to corresponding methods

const controller = require("../controllers/controller.js");

const router = require("express").Router();

//Route for GET method -- a health check method
router.get("/health", controller.healthCheck);

module.exports = router;
