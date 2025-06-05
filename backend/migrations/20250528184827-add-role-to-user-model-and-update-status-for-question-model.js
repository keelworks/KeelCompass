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
    // Remove 'role' column from Users table
    await queryInterface.removeColumn('Users', 'role');

    // Revert 'status' column back to INTEGER
    await queryInterface.changeColumn('Questions', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
