const interestService = require('../services/interestService');
const db = require('../models/index');
const {
  HttpError,
  HttpStatusCodes,
  ServiceErrorHandler,
} = require("../utils/httpError");
const logger = require("../utils/logger");

// Controller method to handle GET /api/interests
const getUserInterests = async (req, res) => {
    //const userId = req.user.id;
    const { user_id } = req.body
    if (!user_id) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'UserId is required' });
    }
    try {
      const interests = await interestService.getUserInterests(user_id)
      if (!interests){
        message = "no interests found"
      }
      else{
        message = "success"
      }
      return res.status(HttpStatusCodes.OK).json(
        { 
          message: message,
          interests: interests
        }
      );
    } catch (error) {
       ServiceErrorHandler(error, res, logger, "getUserInterests")
    }
  };

// POST /api/interests - Save a question to interests
const saveInterest = async (req, res) => {
    //const userId = req.user.id;
    const { userId, question_id } = req.body;
    if (!userId) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'UserId is required' });
    }
    if (!question_id) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Question Id is required' });
    }
    try {
      const result = await interestService.saveInterest(userId, question_id);
    
      return res.status(HttpStatusCodes.CREATED).json(
        {
          message: "Interest created successfully",
          InterestId: result,
        }
      );
    } catch (error) {
      ServiceErrorHandler(error, res, logger, "saveInterest")
    }
  };
  
  // DELETE /api/interests/:id - Delete a question from interests
  const deleteInterest = async (req, res) => {
    //const userId = req.user.id;
    const { userId } = req.body
    if (!userId) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'UserId is required' });
    }
    const { id } = req.params;
  
    try {
      await interestService.deleteInterest(userId, id);
  
      return res.status(HttpStatusCodes.OK).json(
        {
          message: "Interest deleted successfully",
          InterestId: id,
        }
      );
    } catch (error) {
      ServiceErrorHandler(error, res, logger, "deleteInterest")
    }
  };
  
  module.exports = {
    getUserInterests,
    saveInterest,
    deleteInterest
  };