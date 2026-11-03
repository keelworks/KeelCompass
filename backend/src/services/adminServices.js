const logger = require("../utils/logger");
const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

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
const upsertRoleMapping = async (tag, role) => {
  try {
    const trimmedTag = (tag || "").trim();
    if (!trimmedTag) throw new HttpError(400, "Tag is required.");
    if (!VALID_ROLES.includes(role)) {
      throw new HttpError(400, `Role must be one of: ${VALID_ROLES.join(", ")}`);
    }

    const [mapping] = await RoleTagMapping.upsert(
      { tag: trimmedTag, role },
      { returning: true }
    );
    logger.info(`Role mapping saved: "${trimmedTag}" -> ${role}`);
    return mapping;
  } catch (error) {
    logEverything(error, "adminServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error saving role mapping");
  }
};

// remove a tag -> role mapping
const deleteRoleMapping = async (id) => {
  try {
    const deleted = await RoleTagMapping.destroy({ where: { id } });
    if (!deleted) throw new HttpError(404, "Role mapping not found");
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
      attributes: ["id", "username", "email", "raw_role_tag", "created_at"],
      include: [{ model: UserRole, as: "userRoles", attributes: ["role"] }],
      order: [["email", "ASC"]],
    });

    return users.map((user) => {
      const { userRoles, ...rest } = user.toJSON();
      return { ...rest, roles: (userRoles || []).map((r) => r.role) };
    });
  } catch (error) {
    logEverything(error, "adminServices");
    throw new HttpError(500, "Error retrieving users");
  }
};

module.exports = {
  getRoleMappings,
  upsertRoleMapping,
  deleteRoleMapping,
  getAllUsers,
};
