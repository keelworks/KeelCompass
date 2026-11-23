'use strict';

// "Feedback & Suggestions" as a post category is redundant now that there's
// a dedicated Feedback form (see feedbackRoutes/feedbackServices) - remove
// it from the selectable category list. Any question already filed under it
// just loses that one category tag rather than being deleted outright.
const CATEGORY_NAME = 'Feedback & Suggestions';

module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM Categories WHERE name = :name',
      { replacements: { name: CATEGORY_NAME } }
    );
    if (rows.length === 0) return;
    const categoryId = rows[0].id;

    await queryInterface.bulkDelete('QuestionCategories', { category_id: categoryId });
    await queryInterface.bulkDelete('Categories', { id: categoryId });
  },

  async down(queryInterface) {
    await queryInterface.bulkInsert('Categories', [{ name: CATEGORY_NAME }], { ignoreDuplicates: true });
  },
};
