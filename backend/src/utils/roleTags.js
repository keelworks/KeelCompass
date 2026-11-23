// KeelWorks' Google Workspace names follow a convention like "Ahmed (SD |OPT)",
// where the parenthetical before any "|" is a role tag and anything after it
// (e.g. "OPT", a visa status) is noise to ignore for role-mapping purposes.

// used for role-mapping lookups (e.g. "SD") - ignores anything after "|"
const parseRoleTag = (familyName) => {
  if (!familyName) return null;

  const match = familyName.match(/\(([^)]*)\)/);
  if (!match) return null;

  const tag = match[1].split("|")[0].trim();
  return tag.length > 0 ? tag : null;
};

// used for display purposes - keeps the full parenthetical text verbatim
// (e.g. "SD |OPT"), since the status suffix is meaningful to show a person
// even though it's irrelevant for role resolution
const parseFullRoleTag = (familyName) => {
  if (!familyName) return null;

  const match = familyName.match(/\(([^)]*)\)/);
  if (!match) return null;

  const tag = match[1].trim();
  return tag.length > 0 ? tag : null;
};

// strips the "(...)" suffix off a family name, leaving just the surname -
// e.g. "Ahmed (SD |OPT)" -> "Ahmed" - so it can be combined with the given
// name into a clean display name
const stripRoleTag = (familyName) => {
  if (!familyName) return "";
  return familyName.replace(/\s*\([^)]*\)\s*/g, "").trim();
};

// canonical matching key for a role tag: strips all punctuation (keeping
// spaces) and lowercases, so visually-equivalent variants like "Prod. Mgr.",
// "Prod Mgr.", and "Prod. Mgr" all collapse to the same "prod mgr" key. This
// is what gets stored in RoleTagMappings.tag and QuestionTags.tag - it's the
// single canonical identity for a role from here on, not just a lookup key.
const normalizeTag = (tag) => {
  if (!tag) return null;
  const normalized = tag
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

// mention key for the @mention notification system: same as normalizeTag,
// but with spaces removed too (e.g. "prod mgr" -> "prodmgr"), since mentions
// are typed as a single contiguous @token
const mentionKey = (tag) => {
  const normalized = normalizeTag(tag);
  return normalized ? normalized.replace(/\s+/g, "") : null;
};

module.exports = { parseRoleTag, parseFullRoleTag, stripRoleTag, normalizeTag, mentionKey };
