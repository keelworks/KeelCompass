'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Questions', 'pinned', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Questions', 'solved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Questions', 'accepted_comment_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Comments', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('Questions', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Questions', 'deleted_at');
    await queryInterface.removeColumn('Questions', 'accepted_comment_id');
    await queryInterface.removeColumn('Questions', 'solved');
    await queryInterface.removeColumn('Questions', 'pinned');
  },
};
