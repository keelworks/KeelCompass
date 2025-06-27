'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, TEXT, DATE, BOOLEAN, JSON, ENUM } = Sequelize;

    await queryInterface.createTable('Users', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      username: { type: STRING(50), allowNull: false },
      email: { type: STRING(100), allowNull: false, unique: true },
      password: { type: STRING(255), allowNull: false },
      created_at: { type: DATE },
    });

    await queryInterface.createTable('Categories', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: STRING, allowNull: false, unique: true },
    });

    await queryInterface.createTable('Questions', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: { type: STRING(255), allowNull: false },
      description: { type: TEXT },
      status: { type: INTEGER },
      attachment: { type: JSON },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('Comments', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      question_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      parent_id: {
        type: INTEGER,
        allowNull: true,
        references: { model: 'Comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      content: { type: TEXT, allowNull: false },
      attachment: { type: JSON },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('UserQuestionActions', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      question_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      action_type: { type: ENUM('like', 'report'), allowNull: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('UserCommentActions', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      comment_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      action_type: { type: ENUM('like', 'report'), allowNull: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('Interests', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      question_id: {
        type: INTEGER,
        allowNull: true,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      comment_id: {
        type: INTEGER,
        allowNull: true,
        references: { model: 'Comments', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('Notifications', {
      id: { type: INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: { type: STRING(50), allowNull: false },
      message: { type: TEXT, allowNull: false },
      target_url: { type: TEXT },
      read: { type: BOOLEAN, defaultValue: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('QuestionCategories', {
      question_id: {
        type: INTEGER,
        primaryKey: true,
        references: { model: 'Questions', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      category_id: {
        type: INTEGER,
        primaryKey: true,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('QuestionCategories');
    await queryInterface.dropTable('Notifications');
    await queryInterface.dropTable('Interests');
    await queryInterface.dropTable('UserCommentActions');
    await queryInterface.dropTable('UserQuestionActions');
    await queryInterface.dropTable('Comments');
    await queryInterface.dropTable('Questions');
    await queryInterface.dropTable('Categories');
    await queryInterface.dropTable('Users');
  }
};
