'use strict';

// comments are soft-deleted now - deleting one shows a "[deleted]" tombstone
// in its place instead of removing the row outright, so the reply chain
// underneath it stays intact instead of cascading away. Posts still hard
// soft-delete at the Question level and already take their whole thread out
// of view that way, so this is comment-specific.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Comments', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Comments', 'deleted_at');
  },
};
