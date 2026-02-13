'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const isPostgres = queryInterface.sequelize.getDialect() === "postgres";
    const questionsTable = isPostgres ? "\"Questions\"" : "Questions";

    // 1. Attachments: Remove updated_at
    await queryInterface.removeColumn('Attachments', 'updated_at');

    // 2. Users: Add updated_at
    await queryInterface.addColumn('Users', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 3. Questions: Add updated_at; set description to NOT NULL
    await queryInterface.addColumn('Questions', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.changeColumn('Questions', 'description', {
      type: Sequelize.TEXT,
      allowNull: false
    });

    // Change status column to ENUM('pending', 'approved', 'rejected')
    if (isPostgres) {
      await queryInterface.sequelize.query(`
        ALTER TABLE ${questionsTable}
        ALTER COLUMN "status" DROP DEFAULT
      `);
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'enum_Questions_status'
          ) THEN
            CREATE TYPE "enum_Questions_status" AS ENUM ('pending', 'approved', 'rejected');
          END IF;
        END $$;
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE ${questionsTable}
        ALTER COLUMN "status" TYPE "enum_Questions_status"
        USING ("status"::"enum_Questions_status")
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE ${questionsTable}
        ALTER COLUMN "status" SET DEFAULT 'pending'
      `);
      await queryInterface.changeColumn("Questions", "status", {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      });
    } else {
      await queryInterface.changeColumn("Questions", "status", {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      });
    }

    // 4. Comments: Add updated_at
    await queryInterface.addColumn('Comments', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 5. Add updated_at to Interests, Notifications, UserQuestionActions, UserCommentActions if missing
    await queryInterface.addColumn('Interests', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    });
    await queryInterface.addColumn('Notifications', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    });

    // Add question_id and comment_id to Notifications
    await queryInterface.addColumn('Notifications', 'question_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Questions', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('Notifications', 'comment_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Comments', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraints for Attachments ---
    await queryInterface.addConstraint('Attachments', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_attachments_question_id',
      references: { table: 'Questions', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('Attachments', {
      fields: ['comment_id'],
      type: 'foreign key',
      name: 'fk_attachments_comment_id',
      references: { table: 'Comments', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraints for Comments ---
    await queryInterface.addConstraint('Comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_comments_user_id',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('Comments', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_comments_question_id',
      references: { table: 'Questions', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('Comments', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'fk_comments_parent_id',
      references: { table: 'Comments', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraint for Interests ---
    await queryInterface.addConstraint('Interests', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_interests_user_id',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraint for Questions ---
    await queryInterface.addConstraint('Questions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_questions_user_id',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraints for QuestionCategories ---
    await queryInterface.addConstraint('QuestionCategories', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_questioncategories_question_id',
      references: { table: 'Questions', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('QuestionCategories', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'fk_questioncategories_category_id',
      references: { table: 'Categories', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraints for UserCommentActions ---
    await queryInterface.addConstraint('UserCommentActions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_usercommentactions_user_id',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('UserCommentActions', {
      fields: ['comment_id'],
      type: 'foreign key',
      name: 'fk_usercommentactions_comment_id',
      references: { table: 'Comments', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // --- Foreign Key Constraints for UserQuestionActions ---
    await queryInterface.addConstraint('UserQuestionActions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userquestionactions_user_id',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('UserQuestionActions', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'fk_userquestionactions_question_id',
      references: { table: 'Questions', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('UserQuestionActions', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    });
    await queryInterface.addColumn('UserCommentActions', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    });
    // 6. Create QuestionCategories join table if it does not already exist.
    try {
      await queryInterface.describeTable("QuestionCategories");
    } catch (_error) {
      await queryInterface.createTable("QuestionCategories", {
        question_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: "Questions", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: "Categories", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // // Remove all the constraints added in up
    await queryInterface.removeConstraint('Attachments', 'fk_attachments_question_id');
    await queryInterface.removeConstraint('Attachments', 'fk_attachments_comment_id');

    await queryInterface.removeConstraint('Comments', 'fk_comments_user_id');
    await queryInterface.removeConstraint('Comments', 'fk_comments_question_id');
    await queryInterface.removeConstraint('Comments', 'fk_comments_parent_id');

    await queryInterface.removeConstraint('Interests', 'fk_interests_user_id');

    await queryInterface.removeConstraint('Questions', 'fk_questions_user_id');

    await queryInterface.removeConstraint('QuestionCategories', 'fk_questioncategories_question_id');
    await queryInterface.removeConstraint('QuestionCategories', 'fk_questioncategories_category_id');

    await queryInterface.removeConstraint('UserCommentActions', 'fk_usercommentactions_user_id');
    await queryInterface.removeConstraint('UserCommentActions', 'fk_usercommentactions_comment_id');

    await queryInterface.removeConstraint('UserQuestionActions', 'fk_userquestionactions_user_id');
    await queryInterface.removeConstraint('UserQuestionActions', 'fk_userquestionactions_question_id');

    await queryInterface.removeConstraint('Notifications', 'fk_notifications_question_id');
    await queryInterface.removeConstraint('Notifications', 'fk_notifications_comment_id');

    // Remove question_id and comment_id from Notifications
    await queryInterface.removeColumn('Notifications', 'question_id');
    await queryInterface.removeColumn('Notifications', 'comment_id');

    // Drop QuestionCategories join table first
    await queryInterface.dropTable('QuestionCategories');

    // 1. Attachments: Add updated_at back
    await queryInterface.addColumn('Attachments', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // 2. Users: Remove name, updated_at; add username
    await queryInterface.removeColumn('Users', 'name');
    await queryInterface.removeColumn('Users', 'updated_at');
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING(50),
      allowNull: false
    });

    // 3. Questions: Remove updated_at; set description to allowNull true
    await queryInterface.removeColumn('Questions', 'updated_at');
    await queryInterface.changeColumn('Questions', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // 4. Comments: Remove updated_at
    await queryInterface.removeColumn('Comments', 'updated_at');

    // 5. Remove updated_at from Interests, Notifications, UserQuestionActions, UserCommentActions
    await queryInterface.removeColumn('Interests', 'updated_at');
    await queryInterface.removeColumn('Notifications', 'updated_at');
    await queryInterface.removeColumn('UserQuestionActions', 'updated_at');
    await queryInterface.removeColumn('UserCommentActions', 'updated_at');
  }
};
