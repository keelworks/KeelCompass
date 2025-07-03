const express = require("express");
const { getCategories } = require("../controllers/categoryControllers");

const router = express.Router();

// get all categories
router.get("/", getCategories);

module.exports = router;
