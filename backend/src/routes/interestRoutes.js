const express = require("express");
const { body, param } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../utils/validationUtils");

const interestController = require("../controllers/interestControllers");

const router = express.Router();

const createInterestValidation = [
  body('questionId').optional().isInt({ min: 1 }).withMessage('Invalid question ID.'),
  body('commentId').optional().isInt({ min: 1 }).withMessage('Invalid comment ID.'),
  body().custom((_, { req }) => {
    if (!req.body.questionId && !req.body.commentId) throw new Error('Either question ID or comment ID must be provided.');
    return true;
  }),
  handleValidationErrors,
];

const deleteInterestValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid interest ID.'),
  handleValidationErrors,
];

// get user interests
router.get('/', authenticator, interestController.getUserInterests);

// create interest
router.post('/', authenticator, createInterestValidation, interestController.createInterest);

// delete interest
router.delete('/:id', authenticator, deleteInterestValidation, interestController.deleteInterest);

module.exports = router;