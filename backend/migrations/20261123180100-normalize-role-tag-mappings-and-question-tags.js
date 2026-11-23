'use strict';

// collapses visually-equivalent tag variants (e.g. "Prod. Mgr.", "Prod Mgr.",
// "Prod. Mgr") into a single canonical form: punctuation stripped (keeping
// spaces), lowercased. Applies to both RoleTagMappings and QuestionTags,
// since both now use the same canonical tag as their identity.
const ROLE_PRIORITY = ['admin', 'manager', 'staff', 'viewer'];

const normalizeTag = (tag) => {
  if (!tag) return null;
  const normalized = tag
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    // --- RoleTagMappings: normalize + dedupe, keeping the highest role ---
    const [mappings] = await sequelize.query('SELECT id, tag, role FROM RoleTagMappings');
    const byNormalized = new Map();
    for (const row of mappings) {
      const normalized = normalizeTag(row.tag);
      if (!normalized) continue;
      if (!byNormalized.has(normalized)) byNormalized.set(normalized, []);
      byNormalized.get(normalized).push(row);
    }

    for (const [normalized, rows] of byNormalized) {
      const bestRole = rows
        .map((r) => r.role)
        .sort((a, b) => ROLE_PRIORITY.indexOf(a) - ROLE_PRIORITY.indexOf(b))[0];
      const keep = rows[0];
      await sequelize.query(
        'UPDATE RoleTagMappings SET tag = ?, role = ? WHERE id = ?',
        { replacements: [normalized, bestRole, keep.id] }
      );
      const dropIds = rows.slice(1).map((r) => r.id);
      if (dropIds.length > 0) {
        await sequelize.query('DELETE FROM RoleTagMappings WHERE id IN (?)', {
          replacements: [dropIds],
        });
      }
    }

    // --- QuestionTags: normalize + dedupe per question ---
    const [tags] = await sequelize.query('SELECT question_id, tag FROM QuestionTags');
    const seen = new Set();
    for (const row of tags) {
      const normalized = normalizeTag(row.tag);
      if (!normalized || normalized === row.tag) continue;
      const key = `${row.question_id}::${normalized}`;
      if (seen.has(key)) {
        // normalized form already exists for this question - drop the raw duplicate
        await sequelize.query(
          'DELETE FROM QuestionTags WHERE question_id = ? AND tag = ?',
          { replacements: [row.question_id, row.tag] }
        );
      } else {
        seen.add(key);
        await sequelize.query(
          'UPDATE QuestionTags SET tag = ? WHERE question_id = ? AND tag = ?',
          { replacements: [normalized, row.question_id, row.tag] }
        );
      }
    }
  },

  async down() {
    // tag text normalization is not meaningfully reversible
  },
};
