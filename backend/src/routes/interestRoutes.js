const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const authenticator = require("../middlewares/authMiddleware");

// Protected route to get user interests
router.get('/', authenticator, interestController.getUserInterests);

// Protected route to save a new interest
router.post('/', authenticator, interestController.saveInterest);

// Protected route to delete an interest by ID
router.delete('/:id', authenticator, interestController.deleteInterest);

module.exports = router;