// controllers/questionController.js
const db = require('../models/index');
const Question = db.questions;
const User = db.users;

// POST /questions - Register a question
const askQuestion = async (req, res) => {
  const { title, content, userId, status } = req.body;

  try {
    // Validate title and content
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    // Validate user existence
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const questionStatus = status || 'Open'; // Default value set to 'Open'. TODO: Decide the logic for status

    // Create the question
    const newQuestion = await Question.create({
      title,
      content,
      user_id: userId,
      status: questionStatus,
    });

    return res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /questions - Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'username'],
      },
    });
    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /questions/:id - Get a specific question by ID
const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'username'],
      },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  askQuestion,
  getAllQuestions,
  getQuestionById,
};
