'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('Users', 'verification_code', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'verification_code_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'verification_code_sent_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'verification_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'is_verified');
    await queryInterface.removeColumn('Users', 'verification_code');
    await queryInterface.removeColumn('Users', 'verification_code_expires_at');
    await queryInterface.removeColumn('Users', 'verification_code_sent_at');
    await queryInterface.removeColumn('Users', 'verification_attempts');
  },
};
