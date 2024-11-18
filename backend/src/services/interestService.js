const db = require('../models');
const Interest = db.interests;
const Question = db.questions;

const getUserInterests = async (userId) => {
    try {
      const interests = await Interest.findAll({
        where: { user_id: userId }, // Filter by user ID
        include: [
          {
            model: Question,
            as: 'question',
            attributes: ['id', 'title', 'content'] // Only select necessary fields from Question
          }
        ]
      });
  
      return interests;
    } catch (error) {
      console.error('Error fetching interests for user:', error);
      throw error;
    }
  };

const saveInterest = async (userId, questionId) => {
    try {
      // Check if the interest already exists
      const existingInterest = await Interest.findOne({
        where: { user_id: userId, question_id: questionId }
      });
  
      if (existingInterest) {
        return { error: 'Question already saved to interests' };
      }
  
      // Create a new interest
      return await Interest.create({ user_id: userId, question_id: questionId });
    } catch (error) {
      throw new Error('Error saving question to interests');
    }
  };

  const deleteInterest = async (userId, interestId) => {
    try {
      const interest = await Interest.findOne({ where: { id: interestId, user_id: userId } });
      if (!interest) {
        return { error: 'Interest not found or not authorized' };
      }
  
      await interest.destroy();
      return { message: 'Interest deleted successfully' };
    } catch (error) {
      console.error('Error deleting interest:', error);
      throw new Error('Error deleting interest');
    }
  };

  module.exports = {
    getUserInterests,
    saveInterest,
    deleteInterest
  };
