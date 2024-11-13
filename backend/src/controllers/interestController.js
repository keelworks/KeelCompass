const interestService = require('../services/interestService');

// Controller method to handle GET /api/interests
const getUserInterests = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const interests = await interestService.getUserInterests(userId);
      return res.status(200).json(interests);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  };

// POST /api/interests - Save a question to interests
const saveInterest = async (req, res) => {
    const userId = req.user.id;
    const { question_id } = req.body;
  
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
    const userId = req.user.id;
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