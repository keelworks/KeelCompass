'use strict';

// MySQL FULLTEXT indexes so search can rank results by actual relevance
// (MATCH ... AGAINST) instead of only ever sorting by recency - raw SQL
// since Sequelize's query interface doesn't have first-class FULLTEXT support
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE Questions ADD FULLTEXT INDEX questions_title_description_fulltext (title, description)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE Comments ADD FULLTEXT INDEX comments_content_fulltext (content)"
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE Questions DROP INDEX questions_title_description_fulltext"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE Comments DROP INDEX comments_content_fulltext"
    );
  },
};
