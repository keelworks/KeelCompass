const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");
const { normalizeTag } = require("../utils/roleTags");
const auditLogService = require("./auditLogServices");

const db = require("../models");
const User = db.User;
const UserRole = db.UserRole;
const RoleTagMapping = db.RoleTagMapping;

const VALID_ROLES = ["admin", "manager", "staff", "viewer"];

// list every known tag -> role mapping
const getRoleMappings = async () => {
  try {
    const mappings = await RoleTagMapping.findAll({ order: [["tag", "ASC"]] });
    return mappings;
  } catch (error) {
    logEverything(error, "adminServices");
    throw new HttpError(500, "Error retrieving role mappings");
  }
};

// create or update a tag -> role mapping
const upsertRoleMapping = async (adminUserId, tag, role) => {
  try {
    const normalizedTag = normalizeTag(tag);
    if (!normalizedTag) throw new HttpError(400, "Tag is required.");
    if (!VALID_ROLES.includes(role)) {
      throw new HttpError(400, `Role must be one of: ${VALID_ROLES.join(", ")}`);
    }

    const [mapping] = await RoleTagMapping.upsert(
      { tag: normalizedTag, role },
      { returning: true }
    );
    logger.info(`Role mapping saved: "${normalizedTag}" -> ${role}`);
    await auditLogService.logAction(adminUserId, "role_mapping.upsert", "RoleTagMapping", mapping.id, { tag: normalizedTag, role });
    return mapping;
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error saving role mapping");
  }
};

// remove a tag -> role mapping
const deleteRoleMapping = async (adminUserId, id) => {
  try {
    const mapping = await RoleTagMapping.findByPk(id);
    const deleted = await RoleTagMapping.destroy({ where: { id } });
    if (!deleted) throw new HttpError(404, "Role mapping not found");
    await auditLogService.logAction(adminUserId, "role_mapping.delete", "RoleTagMapping", Number(id), { tag: mapping?.tag });
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error deleting role mapping");
  }
};

// list every user with their Google-derived tag and resolved roles
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "raw_role_tag", "manual_role_tag", "reputation_points", "created_at"],
      include: [{ model: UserRole, as: "userRoles", attributes: ["role", "manually_granted"] }],
      order: [["email", "ASC"]],
    });

    return users.map((user) => {
      const { userRoles, ...rest } = user.toJSON();
      const rows = userRoles || [];
      return {
        ...rest,
        roles: rows.map((r) => r.role),
        isManualAdmin: rows.some((r) => r.role === "admin" && r.manually_granted),
      };
    });
  } catch (error) {
    logEverything(error, "adminServices");
    throw new HttpError(500, "Error retrieving users");
  }
};

// manually grant a user the admin role - independent of their Google tag,
// and preserved across sign-ins (see authServices.syncUserRoles)
const grantAdmin = async (adminUserId, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    const [row] = await UserRole.findOrCreate({
      where: { user_id: userId, role: "admin" },
      defaults: { manually_granted: true },
    });
    if (!row.manually_granted) {
      row.manually_granted = true;
      await row.save();
    }
    logger.info(`Admin role manually granted to user ${userId}`);
    await auditLogService.logAction(adminUserId, "user.grant_admin", "User", Number(userId));
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error granting admin role");
  }
};

// revoke a manually-granted admin role
const revokeAdmin = async (userId, requestingAdminId) => {
  try {
    if (Number(userId) === Number(requestingAdminId)) {
      throw new HttpError(400, "You can't revoke your own admin access.");
    }

    const deleted = await UserRole.destroy({
      where: { user_id: userId, role: "admin", manually_granted: true },
    });
    if (!deleted) {
      throw new HttpError(404, "This user doesn't have a manually-granted admin role to revoke.");
    }
    logger.info(`Admin role revoked from user ${userId}`);
    await auditLogService.logAction(requestingAdminId, "user.revoke_admin", "User", Number(userId));
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error revoking admin role");
  }
};

// manually assign/override a user's group tag, independent of their Google
// name - lets an admin manage group membership directly rather than only
// through Google. Pass tag: null to clear the override and fall back to
// whatever Google says.
const setUserTag = async (adminUserId, userId, tag) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User not found");

    const normalizedTag = tag ? normalizeTag(tag) : null;
    user.manual_role_tag = normalizedTag;
    await user.save();

    // make sure the tag is registered as a known mapping if it's new
    if (normalizedTag) {
      const existing = await RoleTagMapping.findOne({ where: { tag: normalizedTag } });
      if (!existing) {
        await RoleTagMapping.create({ tag: normalizedTag, role: "viewer" });
      }
    }

    logger.info(`Manual group tag for user ${userId} set to: ${normalizedTag ?? "(cleared)"}`);
    await auditLogService.logAction(adminUserId, "user.set_tag", "User", Number(userId), { tag: normalizedTag });
    return normalizedTag;
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error setting user's group tag");
  }
};

module.exports = {
  getRoleMappings,
  upsertRoleMapping,
  deleteRoleMapping,
  getAllUsers,
  grantAdmin,
  revokeAdmin,
  setUserTag,
};
