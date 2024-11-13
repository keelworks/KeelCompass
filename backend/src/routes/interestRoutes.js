const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route to get user interests
router.get('/', authMiddleware, interestController.getUserInterests);

// Protected route to save a new interest
router.post('/', authMiddleware, interestController.saveInterest);

// Protected route to delete an interest by ID
router.delete('/:id', authMiddleware, interestController.deleteInterest);

module.exports = router;