const { Op } = require("sequelize");
const { HttpError } = require("./httpError");
const { REACTION_TYPES } = require("../constants/reactionTypes");

// derive hasLiked/likeCount/myReaction/reactionCounts from a raw list of
// {user_id, action_type} rows (which may also contain 'report' rows mixed
// in from the same association - those are ignored here). likeCount stays
// the aggregate across all reaction types so existing sort/scoring logic
// that reads it keeps working unchanged.
const summarizeReactions = (actions, userId) => {
  const reactionCounts = Object.fromEntries(REACTION_TYPES.map((t) => [t, 0]));
  let myReaction = null;
  for (const a of actions || []) {
    if (!REACTION_TYPES.includes(a.action_type)) continue;
    reactionCounts[a.action_type] += 1;
    if (userId && a.user_id === userId) myReaction = a.action_type;
  }
  const likeCount = Object.values(reactionCounts).reduce((sum, n) => sum + n, 0);
  return { hasLiked: myReaction !== null, likeCount, myReaction, reactionCounts };
};

// enforce "at most one of the 6 reaction types per user per target": on a
// new/different reaction, reverses the old reaction's reputation point and
// notification before applying the new one, so a switch never leaks stale
// state and nets to zero reputation change. `report` never goes through
// this path - callers branch on REACTION_TYPES.includes(actionType) first.
const switchReaction = async ({
  Model,
  whereBase,
  actionType,
  authorId,
  actingUserId,
  sourceType,
  targetId,
  User,
  notificationService,
  buildNotification,
}) => {
  const existing = await Model.findAll({
    where: { ...whereBase, action_type: { [Op.in]: REACTION_TYPES } },
  });

  if (existing.some((r) => r.action_type === actionType)) {
    throw new HttpError(409, "User has already submitted this action");
  }

  const isSelf = authorId === actingUserId;

  if (existing.length > 0) {
    if (!isSelf) {
      await User.increment("reputation_points", { by: -existing.length, where: { id: authorId } });
    }
    await notificationService.deleteNotificationsBySource(sourceType, targetId, actingUserId);
    await Model.destroy({ where: { id: { [Op.in]: existing.map((r) => r.id) } } });
  }

  await Model.create({ ...whereBase, action_type: actionType });

  if (!isSelf) {
    await User.increment("reputation_points", { by: 1, where: { id: authorId } });
    await buildNotification();
  }
};

module.exports = { summarizeReactions, switchReaction };
