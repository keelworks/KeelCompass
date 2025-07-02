const logger = require("../utils/logger");

const interestService = require("../services/interestServices");

// get interests by user id
const getUserInterests = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const interests = await interestService.getUserInterests(userId);
    return res.status(200).json(interests);
  } catch (error) {
    logger.error(`Caught in getUserInterests controller: ${error.message}`);
    next(error);
  }
};

// create interest
const createInterest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, commentId } = req.body;

    const result = await interestService.createInterest(userId, questionId, commentId);
    return res.status(201).json(result);
  } catch (error) {
    logger.error(`Caught in createInterest controller: ${error.message}`);
    next(error);
  }
};

// delete interest
const deleteInterest = async (req, res, next) => {  
  try {
    const userId = req.user.id;
    const interestId = req.params.id;

    const deletedId = await interestService.deleteInterest(userId, interestId);
    return res.status(200).json(deletedId);
  } catch (error) {
    logger.error(`Caught in deleteInterest controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getUserInterests,
  createInterest,
  deleteInterest
};
