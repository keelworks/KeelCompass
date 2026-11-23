'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'reputation_points', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    // admin-assigned group override, independent of what Google's name field
    // says - when set, this wins over raw_role_tag for both role resolution
    // and post-visibility matching
    await queryInterface.addColumn('Users', 'manual_role_tag', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'manual_role_tag');
    await queryInterface.removeColumn('Users', 'reputation_points');
  },
};
