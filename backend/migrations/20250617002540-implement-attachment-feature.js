'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, STRING, BLOB, DATE } = Sequelize;

    // Create the new Attachments table
    await queryInterface.createTable('Attachments', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      file_name: { type: STRING, allowNull: false },
      mime_type: { type: STRING, allowNull: false },
      data: { type: BLOB('long'), allowNull: false },
      question_id: {
        type: INTEGER,
        unique: true,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      comment_id: {
        type: INTEGER,
        unique: true,
        references: { model: 'Comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // Remove the old attachment columns
    await queryInterface.removeColumn('Questions', 'attachment');
    await queryInterface.removeColumn('Comments', 'attachment');
  },

  async down (queryInterface, Sequelize) {
    const { JSON } = Sequelize;

    // Drop the Attachments table
    await queryInterface.dropTable('Attachments');

    // Add the old attachment columns back
    await queryInterface.addColumn('Questions', 'attachment', {
      type: JSON,
    });
    await queryInterface.addColumn('Comments', 'attachment', {
      type: JSON,
    });
  }
};
