// defining routes to route request calls to corresponding methods

const controller = require("../controllers/controller.js");

const router = require("express").Router();

const articleRouter = require("./articleRoutes");

//Route for GET method -- a health check method
router.get("/health", controller.healthCheck);

router.use("/api/articles", articleRouter);

module.exports = router;
