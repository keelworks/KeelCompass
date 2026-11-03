const { OAuth2Client } = require("google-auth-library");

const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { generateToken } = require("../utils/jwtUtils");
const { parseRoleTag, parseFullRoleTag, stripRoleTag } = require("../utils/roleTags");

const db = require("../models");
const User = db.User;
const UserRole = db.UserRole;
const RoleTagMapping = db.RoleTagMapping;

const ALLOWED_SIGNUP_DOMAIN = (process.env.ALLOWED_SIGNUP_DOMAIN || "keelworks.org").toLowerCase();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const BOOTSTRAP_ADMIN_EMAIL = (process.env.BOOTSTRAP_ADMIN_EMAIL || "").toLowerCase();

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// resolve a user's Google-derived roles (tag mapping + bootstrap admin), and
// re-sync their UserRoles rows to match - Google stays the source of truth,
// re-evaluated on every sign-in.
const syncUserRoles = async (user, email, rawTag) => {
  const roles = new Set();

  if (rawTag) {
    let mapping = await RoleTagMapping.findOne({ where: { tag: rawTag } });
    if (!mapping) {
      // first time this tag has ever been seen - auto-register it as
      // Viewer so it shows up in the admin's role mappings list (and the
      // question tag picker) without anyone having to add it by hand;
      // an admin can bump its role later.
      try {
        mapping = await RoleTagMapping.create({ tag: rawTag, role: "viewer" });
        logger.info(`Auto-registered new role tag: "${rawTag}" -> viewer`);
      } catch (err) {
        // another concurrent sign-in with the same new tag may have won the race
        mapping = await RoleTagMapping.findOne({ where: { tag: rawTag } });
        if (!mapping) throw err;
      }
    }
    roles.add(mapping.role);
  } else {
    roles.add("viewer");
  }

  if (BOOTSTRAP_ADMIN_EMAIL && email === BOOTSTRAP_ADMIN_EMAIL) {
    roles.add("admin");
  }

  await UserRole.destroy({ where: { user_id: user.id } });
  await UserRole.bulkCreate([...roles].map((role) => ({ user_id: user.id, role })));

  return [...roles];
};

// verify a Google ID token, then find-or-create the matching KeelCompass user
const googleAuth = async (credential) => {
  try {
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new HttpError(401, "Invalid Google sign-in. Please try again.");
    }

    const email = (payload.email || "").toLowerCase();
    const isAllowedWorkspaceAccount =
      payload.email_verified &&
      payload.hd === ALLOWED_SIGNUP_DOMAIN &&
      email.endsWith(`@${ALLOWED_SIGNUP_DOMAIN}`);

    if (!isAllowedWorkspaceAccount) {
      throw new HttpError(403, "Only KeelWorks Google Workspace accounts can sign in to KeelCompass.");
    }

    const rawTag = parseRoleTag(payload.family_name);
    const fullRoleTag = parseFullRoleTag(payload.family_name);
    const cleanFamilyName = stripRoleTag(payload.family_name);
    const displayName = [payload.given_name, cleanFamilyName].filter(Boolean).join(" ").trim() || null;

    let user = await User.findOne({ where: { google_id: payload.sub } });

    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        await user.update({
          google_id: payload.sub,
          picture_url: payload.picture || null,
          raw_role_tag: rawTag,
          full_role_tag: fullRoleTag,
          display_name: displayName,
        });
      }
    }

    if (!user) {
      user = await User.create({
        email,
        google_id: payload.sub,
        picture_url: payload.picture || null,
        raw_role_tag: rawTag,
        full_role_tag: fullRoleTag,
        display_name: displayName,
        role: "volunteer",
      });
      logger.info(`New user created via Google SSO: ${email}`);
    } else {
      const updates = {};
      if (payload.picture && payload.picture !== user.picture_url) updates.picture_url = payload.picture;
      if (rawTag !== user.raw_role_tag) updates.raw_role_tag = rawTag;
      if (fullRoleTag !== user.full_role_tag) updates.full_role_tag = fullRoleTag;
      if (displayName !== user.display_name) updates.display_name = displayName;
      if (Object.keys(updates).length > 0) await user.update(updates);
    }

    const roles = await syncUserRoles(user, email, rawTag);

    const token = generateToken({ id: user.id, email: user.email, username: user.username });
    logger.info(`User signed in via Google SSO: ${email} (tag: ${rawTag ?? "none"}, roles: ${roles.join(",")})`);
    return { token, needsProfile: !user.username };
  } catch (error) {
    logEverything(error, "authServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error signing in with Google");
  }
};

module.exports = {
  googleAuth,
};
