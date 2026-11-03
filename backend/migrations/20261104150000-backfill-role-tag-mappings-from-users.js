'use strict';

// one-time backfill: register a Viewer-level RoleTagMapping for every
// distinct raw_role_tag already seen on existing Users, so the admin's role
// mappings list (and the question tag picker) starts populated with
// whoever has already signed in, instead of starting empty. Tags already
// mapped are left untouched (INSERT IGNORE via ignoreDuplicates).
module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      `SELECT DISTINCT raw_role_tag FROM Users WHERE raw_role_tag IS NOT NULL AND raw_role_tag <> ''`
    );
    if (!rows.length) return;

    const now = new Date();
    const records = rows.map((r) => ({
      tag: r.raw_role_tag,
      role: 'viewer',
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('RoleTagMappings', records, { ignoreDuplicates: true });
  },

  async down() {
    // data backfill, not meaningfully reversible
  },
};
