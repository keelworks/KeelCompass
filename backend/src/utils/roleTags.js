// KeelWorks' Google Workspace names follow a convention like "Ahmed (SD |OPT)",
// where the parenthetical before any "|" is a role tag and anything after it
// (e.g. "OPT", a visa status) is noise to ignore.
const parseRoleTag = (familyName) => {
  if (!familyName) return null;

  const match = familyName.match(/\(([^)]*)\)/);
  if (!match) return null;

  const tag = match[1].split("|")[0].trim();
  return tag.length > 0 ? tag : null;
};

module.exports = { parseRoleTag };
