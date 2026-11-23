'use strict';

// starter set of commonly-used categories for a workplace Q&A/forum board,
// on top of whatever already exists (e.g. the original seed data's "Career
// Development", "Job Search", "Education", "KeelWorks")
const SAMPLE_CATEGORIES = [
  "General Discussion",
  "Onboarding",
  "IT & Tech Support",
  "HR & Policies",
  "Tools & Resources",
  "Announcements",
  "Events",
  "Feedback & Suggestions",
  "Networking",
  "Mentorship",
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Categories',
      SAMPLE_CATEGORIES.map((name) => ({ name })),
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', { name: SAMPLE_CATEGORIES });
  },
};
