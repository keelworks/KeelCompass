const logger = require("../utils/logger");
const feedbackService = require("../services/feedbackServices");
const auditLogService = require("../services/auditLogServices");

const createFeedback = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;
    const result = await feedbackService.createFeedback(userId, message);
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Caught in createFeedback controller: ${error.message}`);
    next(error);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getAllFeedback();
    res.status(200).json(feedback);
  } catch (error) {
    logger.error(`Caught in getAllFeedback controller: ${error.message}`);
    next(error);
  }
};

const setFeedbackRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const result = await feedbackService.setFeedbackRead(id, read);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Caught in setFeedbackRead controller: ${error.message}`);
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    await feedbackService.deleteFeedback(id);
    await auditLogService.logAction(req.user.id, "delete_feedback", "feedback", id);
    res.status(200).json({ message: "Feedback deleted successfully", id });
  } catch (error) {
    logger.error(`Caught in deleteFeedback controller: ${error.message}`);
    next(error);
  }
};

module.exports = { createFeedback, getAllFeedback, setFeedbackRead, deleteFeedback };
