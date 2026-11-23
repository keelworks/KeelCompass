'use strict';

// a transparency log of prior versions of a post/comment's content - every
// time an author saves an edit, the version being replaced is snapshotted
// here first, so "edited" isn't just a timestamp with nothing behind it
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EditHistories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      entity_type: { type: Sequelize.ENUM('question', 'comment'), allowNull: false },
      entity_id: { type: Sequelize.INTEGER, allowNull: false },
      previous_title: { type: Sequelize.STRING, allowNull: true },
      previous_content: { type: Sequelize.TEXT, allowNull: false },
      edited_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('EditHistories', ['entity_type', 'entity_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('EditHistories');
  },
};
