const express = require("express");
const { body, param } = require("express-validator");
const authenticator = require("../middlewares/authMiddleware");
const interestController = require("../controllers/interestController");
const { handleValidationErrors } = require("../utils/validationUtils");

const router = express.Router();

const saveInterestValidation = [
  body('questionId').optional().isInt({ min: 1 }).withMessage('Question ID must be a positive integer.'),
  body('commentId').optional().isInt({ min: 1 }).withMessage('Comment ID must be a positive integer.'),
  body().custom((_, { req }) => {
    if (!req.body.questionId && !req.body.commentId) {
      throw new Error('Either questionId or commentId must be provided.');
    }
    return true;
  }),
  handleValidationErrors,
];

const deleteInterestValidation = [
  param('id').isInt({ gt: 0 }).withMessage('Interest ID must be a positive integer.'),
  handleValidationErrors,
];

// post interest
router.post('/', authenticator, saveInterestValidation, interestController.saveInterest);

// get user interests
router.get('/', authenticator, interestController.getUserInterests);

// delete interest
router.delete('/:id', authenticator, deleteInterestValidation, interestController.deleteInterest);

module.exports = router;