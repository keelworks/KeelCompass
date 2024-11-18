const db = require("../models/index");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const Interest = db.interests;
const User = db.users;
const Question = db.questions;

const getUserInterests = async (userId) => {
    const user = await User.findByPk(userId);  
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }
    const interests = await Interest.findAll({
      where: { user_id: userId }, // Filter by user ID
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'title', 'description'] 
        }
      ]
    });
    return interests;
  };

const saveInterest = async (userId, questionId) => {
    const user = await User.findByPk(userId);  
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, 'question not found' );
    }
    const interest = await Interest.findOne({ where: { user_id: userId, question_id: questionId } });
    if (!interest){
      // Create a new interest
      const newInterest = await Interest.create({ user_id: userId, question_id: questionId });
      return newInterest.id
    }
    else{
      throw new HttpError(HttpStatusCodes.CONFLICT, "interest already exists");
    }

};

  const deleteInterest = async (userId, interestId) => {
    const interest = await Interest.findByPk(interestId);
    if (!interest) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, 'interest not found' );
    }
    if (interest.user_id != userId) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }
    await interest.destroy();
  };

  module.exports = {
    getUserInterests,
    saveInterest,
    deleteInterest
  };
