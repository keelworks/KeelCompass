const logger = require("../utils/logger");

const adminService = require("../services/adminServices");

const getRoleMappings = async (req, res, next) => {
  try {
    const mappings = await adminService.getRoleMappings();
    res.status(200).json(mappings);
  } catch (error) {
    logger.error(`Caught in getRoleMappings controller: ${error.message}`);
    next(error);
  }
};

const createRoleMapping = async (req, res, next) => {
  try {
    const { tag, role } = req.body;
    const mapping = await adminService.upsertRoleMapping(tag, role);
    res.status(201).json(mapping);
  } catch (error) {
    logger.error(`Caught in createRoleMapping controller: ${error.message}`);
    next(error);
  }
};

const deleteRoleMapping = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteRoleMapping(id);
    res.status(204).send();
  } catch (error) {
    logger.error(`Caught in deleteRoleMapping controller: ${error.message}`);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Caught in getAllUsers controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getRoleMappings,
  createRoleMapping,
  deleteRoleMapping,
  getAllUsers,
};
