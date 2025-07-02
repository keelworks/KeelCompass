const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categoryControllers");

// get all categories
router.get("/", getCategories);

module.exports = router;
