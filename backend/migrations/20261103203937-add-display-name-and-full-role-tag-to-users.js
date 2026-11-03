'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'display_name', {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'full_role_tag', {
      type: Sequelize.STRING(150),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'display_name');
    await queryInterface.removeColumn('Users', 'full_role_tag');
  },
};
