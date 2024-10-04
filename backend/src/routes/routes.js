// defining routes to route request calls to corresponding methods

const controller = require("../controllers/controller.js");

const router = require("express").Router();

//Route for GET method -- a health check method
router.get("/health", controller.healthCheck);
router.post('/', articleController.createArticle);
router.get('/tag/:tagName', articleController.getArticlesByTag);

module.exports = router;
