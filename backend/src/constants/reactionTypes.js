const ActionTypes = require("./actionTypes");

// deliberately excludes ActionTypes.REPORT - report is an independent
// moderation action, not a reaction, and a user can have both at once
const REACTION_TYPES = [
  ActionTypes.LIKE,
  ActionTypes.CELEBRATE,
  ActionTypes.SUPPORT,
  ActionTypes.LOVE,
  ActionTypes.INSIGHTFUL,
  ActionTypes.CURIOUS,
];

const REACTION_META = {
  [ActionTypes.LIKE]: { emoji: "👍", label: "Like" },
  [ActionTypes.CELEBRATE]: { emoji: "🎉", label: "Celebrate" },
  [ActionTypes.SUPPORT]: { emoji: "🤝", label: "Support" },
  [ActionTypes.LOVE]: { emoji: "❤️", label: "Love" },
  [ActionTypes.INSIGHTFUL]: { emoji: "💡", label: "Insightful" },
  [ActionTypes.CURIOUS]: { emoji: "🤔", label: "Curious" },
};

module.exports = { REACTION_TYPES, REACTION_META };
