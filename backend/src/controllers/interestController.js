const interestService = require('../services/interestService');
const db = require('../models/index');
const Question = db.questions;
const User = db.users;
// Controller method to handle GET /api/interests
const getUserInterests = async (req, res) => {
    //const userId = req.user.id;
    console.log('Received request:', req.body);
    const {user_id}=req.body
    if (!user_id) {
        return res.status(400).json({ error: 'UserId is required' });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
      const interests = await interestService.getUserInterests(user_id);
      if(!interests){
        return res.status(404).json({ error: 'Interests not Found' });
      }
      return res.status(200).json(interests);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  };

// POST /api/interests - Save a question to interests
const saveInterest = async (req, res) => {
    //const userId = req.user.id;
    const { userId, question_id } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }
    if (!question_id) {
        return res.status(400).json({ error: 'Question Id is required' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const question = await Question.findByPk(question_id);
    if (!question) {
      return res.status(400).json({ error: 'Invalid question ID' });
    }
    try {
      const result = await interestService.saveInterest(userId, question_id);
  
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  // DELETE /api/interests/:id - Delete a question from interests
  const deleteInterest = async (req, res) => {
    //const userId = req.user.id;
    const userId=req.body
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
    }
    const { id } = req.params;
  
    try {
      const result = await interestService.deleteInterest(userId, id);
  
      if (result.error) {
        return res.status(404).json({ error: result.error });
      }
  
      return res.status(200).json(result);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = {
    getUserInterests,
    saveInterest,
    deleteInterest
  };