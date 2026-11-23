'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ENUM = Sequelize.ENUM("like", "celebrate", "support", "love", "insightful", "curious", "report");
    await queryInterface.changeColumn("UserQuestionActions", "action_type", {
      type: ENUM,
      allowNull: false,
    });
    await queryInterface.changeColumn("UserCommentActions", "action_type", {
      type: ENUM,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    const ENUM = Sequelize.ENUM("like", "report");
    await queryInterface.changeColumn("UserQuestionActions", "action_type", {
      type: ENUM,
      allowNull: false,
    });
    await queryInterface.changeColumn("UserCommentActions", "action_type", {
      type: ENUM,
      allowNull: false,
    });
  },
};
