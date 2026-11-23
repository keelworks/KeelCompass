'use strict';

// lets someone mute a specific thread so its activity (new comments,
// replies, likes, mentions, bookmarks) stops generating notifications for
// them, without affecting anyone else or the thread itself
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MutedQuestions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('MutedQuestions', {
      fields: ['user_id', 'question_id'],
      type: 'unique',
      name: 'muted_questions_user_question_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MutedQuestions');
  },
};
