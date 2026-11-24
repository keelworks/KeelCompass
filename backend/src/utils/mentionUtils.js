const db = require("../models");
const User = db.User;
const { mentionKey } = require("./roleTags");

// resolves every user currently holding the given role tag to their ids,
// checking the manual_role_tag admin override before falling back to the
// Google-derived raw_role_tag - consistent with how isUser.js computes
// normalized_role_tag (manual_role_tag || raw_role_tag). `tag` can be either
// a human-readable tag ("Prod Mgr") or an already-tokenized @mention
// ("prodmgr") - both canonicalize to the same mentionKey, so group mentions
// resolve the same way whether they come from free-text @token scanning
// (questions) or an explicit tag picked from an autocomplete list (comments).
const resolveUsersByRoleTag = async (tag) => {
  const targetKey = mentionKey(tag);
  if (!targetKey) return [];

  const users = await User.findAll({ attributes: ["id", "raw_role_tag", "manual_role_tag"] });
  return users
    .filter((u) => mentionKey(u.manual_role_tag || u.raw_role_tag) === targetKey)
    .map((u) => u.id);
};

module.exports = { resolveUsersByRoleTag };
