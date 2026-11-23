'use strict';

// feedback no longer tries to email anyone - it's purely stored and
// reviewed from the admin panel, so the "did the email go out" flag is gone
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('Feedbacks', 'email_sent');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Feedbacks', 'email_sent', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
