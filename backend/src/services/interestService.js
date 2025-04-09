const db = require("../models");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");
const Interest = db.interests;
const User = db.users;
const Question = db.questions;

const getUserInterests = async (loginUser) => {
    const user = await User.findByPk(loginUser.id);  
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }
    const interests = await Interest.findAll({
      where: { user_id: loginUser.id }, // Filter by user ID
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

const saveInterest = async (loginUser, questionId) => {
    const user = await User.findByPk(loginUser.id);  
    if (!user) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "user not found");
    }
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, 'question not found' );
    }
    const interest = await Interest.findOne({ where: { user_id: loginUser.id, question_id: questionId } });
    if (!interest){
      // Create a new interest
      const newInterest = await Interest.create({ user_id: loginUser.id, question_id: questionId });
      return newInterest.id
    }
    else{
      throw new HttpError(HttpStatusCodes.CONFLICT, "interest already exists");
    }

};

  const deleteInterest = async (loginUser, interestId) => {
    const interest = await Interest.findByPk(interestId);
    if (!interest) {
      throw new HttpError(HttpStatusCodes.NOT_FOUND, 'interest not found' );
    }
    if (interest.user_id != loginUser.id) {
      throw new HttpError(HttpStatusCodes.UNAUTHORIZED, "no permission");
    }
    await interest.destroy();
  };

  module.exports = {
    getUserInterests,
    saveInterest,
    deleteInterest
  };
