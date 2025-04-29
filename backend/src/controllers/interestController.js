const interestService = require('../services/interestService');
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// get all interests by user id
const getUserInterests = async (req, res) => {
  const user = req.loginUser;
  try {
    const interests = await interestService.getUserInterests(user)
    if (!interests) {
      message = "no interests found"
    }
    else {
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

// post interest
const saveInterest = async (req, res) => {
  const user = req.loginUser;
  const { question_id, comment_id } = req.body;
  if (!question_id && !comment_id) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Either question_id or comment_id must be provided.' });
  }
  try {
    const result = await interestService.saveInterest(user, question_id, comment_id);
    return res.status(HttpStatusCodes.CREATED).json({
      message: "Interest created successfully",
      InterestId: result,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "saveInterest");
  }
};

// delete interest by id
const deleteInterest = async (req, res) => {
  const user = req.loginUser;
  const { id } = req.params;

  try {
    await interestService.deleteInterest(user, id);

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
