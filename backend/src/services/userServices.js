const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { generateToken } = require("../utils/jwtUtils");

const db = require("../models");
const User = db.User;
const UserRole = db.UserRole;
const Question = db.Question;
const Comment = db.Comment;

const USER_ATTRIBUTES = ['id', 'username', 'email', 'role', 'picture_url', 'raw_role_tag', 'full_role_tag', 'display_name', 'reputation_points', 'created_at', 'updated_at'];

// thresholds for the simple, always-computed-on-read badge set - no stored
// badges table to keep in sync, just a point-in-time read of real activity
const computeBadges = ({ reputationPoints, questionsAsked, commentsMade }) => {
  const badges = [];
  if (questionsAsked >= 1) badges.push("First Post");
  if (questionsAsked >= 5) badges.push("Contributor");
  if (commentsMade >= 10) badges.push("Discussion Starter");
  if (reputationPoints >= 20) badges.push("Helper");
  if (reputationPoints >= 50) badges.push("Popular");
  return badges;
};

// flatten the `userRoles` association into a plain `roles: string[]` field
const withRoles = (user) => {
  const { userRoles, ...rest } = user.toJSON();
  return { ...rest, roles: (userRoles || []).map((r) => r.role) };
};

// get logged in user
const getLoggedInUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: USER_ATTRIBUTES,
      include: [{ model: UserRole, as: 'userRoles', attributes: ['role'] }],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user data for user ID: ${userId}`);
    return withRoles(user);
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user data");
  }
};

// get user by id
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: USER_ATTRIBUTES,
      include: [{ model: UserRole, as: 'userRoles', attributes: ['role'] }],
    });
    if (!user) throw new HttpError(404, "User not found");

    logger.info(`Retrieved user by ID: ${userId}`);
    return withRoles(user);
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user");
  }
};

// complete profile setup (first login via Google) by choosing a username
const updateMe = async (userId, username) => {
  try {
    const trimmedUsername = (username || "").trim();
    if (!trimmedUsername) throw new HttpError(400, "Username is required.");

    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    await user.update({ username: trimmedUsername });

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    logger.info(`Profile completed for user ID: ${userId}`);
    return token;
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error updating profile");
  }
};

// top N users by reputation points
const getLeaderboard = async (limit = 20) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'display_name', 'picture_url', 'reputation_points'],
      where: { reputation_points: { [db.Sequelize.Op.gt]: 0 } },
      order: [['reputation_points', 'DESC']],
      limit,
    });
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.display_name,
      pictureUrl: u.picture_url,
      reputationPoints: u.reputation_points,
    }));
  } catch (error) {
    logEverything(error, "userServices");
    throw new HttpError(500, "Error retrieving leaderboard");
  }
};

// directory search for @mention autocomplete - matches against this app's
// own Users table (everyone who has ever signed in via Google SSO), not the
// live Google Workspace directory. That keeps this working today with zero
// extra Google Cloud setup; the trade-off is someone who has never signed
// into KeelCompass won't show up until they do.
const searchUsersForMention = async (query, excludeUserId, limit = 8) => {
  try {
    const q = (query || "").trim();
    if (!q) return [];
    const { Op } = db.Sequelize;
    const users = await User.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: excludeUserId ?? 0 } },
          {
            [Op.or]: [
              { display_name: { [Op.like]: `%${q}%` } },
              { username: { [Op.like]: `%${q}%` } },
              { email: { [Op.like]: `%${q}%` } },
            ],
          },
        ],
      },
      attributes: ['id', 'username', 'display_name', 'picture_url', 'email', 'full_role_tag'],
      limit,
    });
    return users.map((u) => ({
      id: u.id,
      displayName: u.display_name || u.username,
      email: u.email,
      pictureUrl: u.picture_url,
      fullRoleTag: u.full_role_tag || null,
    }));
  } catch (error) {
    logEverything(error, "userServices");
    throw new HttpError(500, "Error searching users");
  }
};

// a user's own activity stats + earned badges
const getUserStats = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'display_name', 'reputation_points'],
    });
    if (!user) throw new HttpError(404, "User not found");

    const [questionsAsked, commentsMade] = await Promise.all([
      Question.count({ where: { user_id: userId, deleted_at: null } }),
      Comment.count({ where: { user_id: userId } }),
    ]);

    const badges = computeBadges({
      reputationPoints: user.reputation_points,
      questionsAsked,
      commentsMade,
    });

    return {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      reputationPoints: user.reputation_points,
      questionsAsked,
      commentsMade,
      badges,
    };
  } catch (error) {
    logEverything(error, "userServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving user stats");
  }
};

module.exports = {
  getLoggedInUser,
  getUserById,
  updateMe,
  getLeaderboard,
  getUserStats,
  searchUsersForMention,
};
