// Article related routes

const { body, validationResult } = require("express-validator");
const { HttpStatusCodes } = require("../utils/httpError");

const express = require('express');
const router = express.Router();
const {
  askQuestion,
  getAllQuestions,
  getQuestionById,
} = require('../controllers/questionController');

// POST /questions - Ask a question
router.post('/', askQuestion);

// GET /questions - Get all questions
router.get('/', getAllQuestions);

// GET /questions/:id - Get a specific question by ID
router.get('/:id', getQuestionById);

module.exports = router;
