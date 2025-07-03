const express = require("express");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const interestController = require("../controllers/interestControllers");

const router = express.Router();
router.use(isUser);

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
router.get('/', interestController.getUserInterests);

// create interest
router.post('/', createInterestValidation, interestController.createInterest);

// delete interest
router.delete('/:id', deleteInterestValidation, interestController.deleteInterest);

module.exports = router;