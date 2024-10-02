// defining routes to route request calls to corresponding methods

const controller = require("../controllers/controller.js");

const router = require("express").Router();

//Route for GET method -- a health check method
router.get("/health", controller.healthCheck);

//Route for GET method -- a health check method
router.post("/resetpassword", controller.passwordReset);

//Route for GET method -- a health check method
router.post("/verifyOTP", controller.verifyOTP);

//Route for GET method -- a health check method
router.post("/updatePassword", controller.updatePassword);

module.exports = router;
