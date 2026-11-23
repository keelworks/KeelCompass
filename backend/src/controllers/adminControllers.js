const logger = require("../utils/logger");

const adminService = require("../services/adminServices");
const auditLogService = require("../services/auditLogServices");
const questionService = require("../services/questionServices");
const moderationService = require("../services/moderationServices");
const insightsService = require("../services/insightsServices");

const getInsights = async (req, res, next) => {
  try {
    const insights = await insightsService.getInsights();
    res.status(200).json(insights);
  } catch (error) {
    logger.error(`Caught in getInsights controller: ${error.message}`);
    next(error);
  }
};

const getAuditLog = async (req, res, next) => {
  try {
    const entries = await auditLogService.getAuditLog();
    res.status(200).json(entries);
  } catch (error) {
    logger.error(`Caught in getAuditLog controller: ${error.message}`);
    next(error);
  }
};

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
    const mapping = await adminService.upsertRoleMapping(req.user.id, tag, role);
    res.status(201).json(mapping);
  } catch (error) {
    logger.error(`Caught in createRoleMapping controller: ${error.message}`);
    next(error);
  }
};

const deleteRoleMapping = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteRoleMapping(req.user.id, id);
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

const grantAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.grantAdmin(req.user.id, id);
    res.status(200).json({ message: "Admin role granted." });
  } catch (error) {
    logger.error(`Caught in grantAdmin controller: ${error.message}`);
    next(error);
  }
};

const revokeAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.revokeAdmin(id, req.user.id);
    res.status(200).json({ message: "Admin role revoked." });
  } catch (error) {
    logger.error(`Caught in revokeAdmin controller: ${error.message}`);
    next(error);
  }
};

const setUserTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;
    const normalizedTag = await adminService.setUserTag(req.user.id, id, tag);
    res.status(200).json({ tag: normalizedTag });
  } catch (error) {
    logger.error(`Caught in setUserTag controller: ${error.message}`);
    next(error);
  }
};

// --- question moderation (posts, bulk actions, pin, soft-delete) ---

const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getAllQuestionsForAdmin();
    res.status(200).json(questions);
  } catch (error) {
    logger.error(`Caught in getAllQuestions controller: ${error.message}`);
    next(error);
  }
};

const togglePin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pinned = await questionService.togglePin(id);
    await auditLogService.logAction(req.user.id, "question.toggle_pin", "Question", Number(id), { pinned });
    res.status(200).json({ pinned });
  } catch (error) {
    logger.error(`Caught in togglePin controller: ${error.message}`);
    next(error);
  }
};

const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    const count = await questionService.bulkUpdateStatus(ids, status);
    await auditLogService.logAction(req.user.id, "question.bulk_status", "Question", null, { ids, status });
    res.status(200).json({ updated: count });
  } catch (error) {
    logger.error(`Caught in bulkUpdateStatus controller: ${error.message}`);
    next(error);
  }
};

const bulkAddTags = async (req, res, next) => {
  try {
    const { ids, tags } = req.body;
    const count = await questionService.bulkAddTags(ids, tags);
    await auditLogService.logAction(req.user.id, "question.bulk_tag", "Question", null, { ids, tags });
    res.status(200).json({ tagged: count });
  } catch (error) {
    logger.error(`Caught in bulkAddTags controller: ${error.message}`);
    next(error);
  }
};

const getDeletedQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getDeletedQuestions();
    res.status(200).json(questions);
  } catch (error) {
    logger.error(`Caught in getDeletedQuestions controller: ${error.message}`);
    next(error);
  }
};

const restoreQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await questionService.restoreQuestion(id);
    await auditLogService.logAction(req.user.id, "question.restore", "Question", Number(id));
    res.status(200).json({ message: "Question restored." });
  } catch (error) {
    logger.error(`Caught in restoreQuestion controller: ${error.message}`);
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const reports = await moderationService.getReports();
    res.status(200).json(reports);
  } catch (error) {
    logger.error(`Caught in getReports controller: ${error.message}`);
    next(error);
  }
};

const dismissReport = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    await moderationService.dismissReport(type, id);
    await auditLogService.logAction(req.user.id, "report.dismiss", type, Number(id));
    res.status(204).send();
  } catch (error) {
    logger.error(`Caught in dismissReport controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getRoleMappings,
  createRoleMapping,
  deleteRoleMapping,
  getAllUsers,
  grantAdmin,
  revokeAdmin,
  setUserTag,
  getAuditLog,
  getAllQuestions,
  togglePin,
  bulkUpdateStatus,
  bulkAddTags,
  getDeletedQuestions,
  restoreQuestion,
  getReports,
  dismissReport,
  getInsights,
};
