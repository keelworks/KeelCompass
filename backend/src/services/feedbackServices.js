const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Feedback = db.Feedback;
const User = db.User;

// submit feedback - stored for review in the admin panel, nothing else
const createFeedback = async (userId, message) => {
  try {
    const trimmed = (message || "").trim();
    if (!trimmed) throw new HttpError(400, "Feedback message is required.");

    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    const feedback = await Feedback.create({
      user_id: userId,
      message: trimmed,
    });

    logger.info(`Feedback ${feedback.id} submitted by user ${userId}`);
    return { id: feedback.id };
  } catch (error) {
    logEverything(error, "feedbackServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error submitting feedback");
  }
};

// list all feedback (admin only)
const getAllFeedback = async () => {
  try {
    const feedback = await Feedback.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "username", "email", "display_name"] }],
      order: [["created_at", "DESC"]],
    });
    return feedback.map((f) => ({
      id: f.id,
      message: f.message,
      read: f.read,
      createdAt: f.created_at,
      user: {
        id: f.user?.id,
        username: f.user?.username,
        email: f.user?.email,
        displayName: f.user?.display_name,
      },
    }));
  } catch (error) {
    logEverything(error, "feedbackServices");
    throw new HttpError(500, "Error retrieving feedback");
  }
};

// mark/unmark a feedback submission as read (admin only)
const setFeedbackRead = async (feedbackId, read) => {
  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) throw new HttpError(404, "Feedback not found");
    feedback.read = !!read;
    await feedback.save();
    return { id: feedback.id, read: feedback.read };
  } catch (error) {
    logEverything(error, "feedbackServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating feedback");
  }
};

// delete a feedback submission (admin only)
const deleteFeedback = async (feedbackId) => {
  try {
    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) throw new HttpError(404, "Feedback not found");
    await feedback.destroy();
    return feedbackId;
  } catch (error) {
    logEverything(error, "feedbackServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting feedback");
  }
};

module.exports = { createFeedback, getAllFeedback, setFeedbackRead, deleteFeedback };
