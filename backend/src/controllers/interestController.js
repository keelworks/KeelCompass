const interestService = require("../services/interestService");
const logger = require("../utils/logger");
const { HttpStatusCodes, ServiceErrorHandler } = require("../utils/httpError");

// save interest
const saveInterest = async (req, res) => {
  const user = req.loginUser;
  const { questionId, commentId } = req.body;
  try {
    const result = await interestService.saveInterest(user, questionId, commentId);
    return res.status(HttpStatusCodes.CREATED).json({
      message: "Interest created successfully",
      interestId: result,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "saveInterest");
  }
};

// get interests by user id
const getUserInterests = async (req, res) => {
  const user = req.loginUser;
  try {
    const interests = await interestService.getUserInterests(user);
    return res.status(HttpStatusCodes.OK).json({
      message: "success",
      interests: interests,
    });
  } catch (error) {
    ServiceErrorHandler(error, res, logger, "getUserInterests");
  }
};

// delete interest
const deleteInterest = async (req, res) => {
  const user = req.loginUser;
  const { id } = req.params;

  try {
    await interestService.deleteInterest(user, id);

    return res.status(HttpStatusCodes.OK).json(
      {
        message: "Interest deleted successfully",
        interestId: id,
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
