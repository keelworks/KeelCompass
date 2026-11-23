'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notifications', 'source_type', {
      type: Sequelize.STRING(40),
      allowNull: true,
    });
    await queryInterface.addColumn('Notifications', 'source_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('Notifications', 'actor_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addIndex('Notifications', ['source_type', 'source_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('Notifications', ['source_type', 'source_id']);
    await queryInterface.removeColumn('Notifications', 'actor_user_id');
    await queryInterface.removeColumn('Notifications', 'source_id');
    await queryInterface.removeColumn('Notifications', 'source_type');
  },
};
