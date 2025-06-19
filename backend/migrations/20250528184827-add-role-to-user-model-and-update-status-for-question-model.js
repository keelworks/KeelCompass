'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Normalize existing numeric status values to string before changing the column type
    await queryInterface.sequelize.query(`
      UPDATE Questions SET status = 
        CASE 
          WHEN status = 0 THEN 'pending'
          WHEN status = 1 THEN 'approved'
          WHEN status = 2 THEN 'rejected'
          ELSE 'pending'
        END
    `);

    // Change the 'status' column from ENUM or INT to STRING
    await queryInterface.changeColumn('Questions', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    });

    // Add 'role' column to Users table
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('volunteer', 'facilitator'),
      allowNull: false,
      defaultValue: 'volunteer',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove 'role' column from Users table (safe even if already removed)
    const tableDesc = await queryInterface.describeTable('Users');
    if (tableDesc.role) {
      await queryInterface.removeColumn('Users', 'role');
    }

    // Convert string status values back to integers before changing the column type
    await queryInterface.sequelize.query(`
      UPDATE Questions SET status = 
        CASE 
          WHEN status = 'pending' THEN 0
          WHEN status = 'approved' THEN 1
          WHEN status = 'rejected' THEN 2
          ELSE NULL
        END
      WHERE status IN ('pending', 'approved', 'rejected')
    `);

    // Revert 'status' column back to INTEGER
    await queryInterface.changeColumn('Questions', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Remove ENUM type if it still exists (MySQL/Postgres safe cleanup)
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query("DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role') THEN DROP TYPE \"enum_Users_role\"; END IF; END$$;");
    }
  }
};
