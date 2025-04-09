const express = require('express');
const authenticator = require("../middlewares/authMiddleware");
const interestController = require('../controllers/interestController');

const router = express.Router();

// post interest (protected)
router.post('/', authenticator, interestController.saveInterest);

// get user interests (protected)
router.get('/', authenticator, interestController.getUserInterests);

// delete interest (protected)
router.delete('/:id', authenticator, interestController.deleteInterest);

module.exports = router;