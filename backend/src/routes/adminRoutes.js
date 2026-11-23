const express = require("express");
const { body } = require("express-validator");
const { handleValidationErrors } = require("../utils/validationUtils");
const isUser = require("../middlewares/isUser");
const requireRole = require("../middlewares/requireRole");
const {
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
} = require("../controllers/adminControllers");
const { getAllFeedback, setFeedbackRead, deleteFeedback } = require("../controllers/feedbackControllers");

const router = express.Router();

const roleMappingValidation = [
  body('tag').notEmpty().withMessage('Tag is required.'),
  body('role').isIn(['admin', 'manager', 'staff', 'viewer']).withMessage('Invalid role.'),
  handleValidationErrors,
];

// every admin route requires a signed-in user with the admin role
router.use(isUser, requireRole('admin'));

router.get('/role-mappings', getRoleMappings);
router.post('/role-mappings', roleMappingValidation, createRoleMapping);
router.delete('/role-mappings/:id', deleteRoleMapping);

router.get('/users', getAllUsers);
router.post('/users/:id/admin', grantAdmin);
router.delete('/users/:id/admin', revokeAdmin);
router.patch('/users/:id/tag', setUserTag);

router.get('/feedback', getAllFeedback);
router.patch('/feedback/:id/read', setFeedbackRead);
router.delete('/feedback/:id', deleteFeedback);
router.get('/audit-log', getAuditLog);

router.get('/questions', getAllQuestions);
router.patch('/questions/:id/pin', togglePin);
router.patch('/questions/bulk-status', bulkUpdateStatus);
router.patch('/questions/bulk-tag', bulkAddTags);
router.get('/questions/deleted', getDeletedQuestions);
router.post('/questions/:id/restore', restoreQuestion);

router.get('/reports', getReports);
router.delete('/reports/:type/:id', dismissReport);

router.get('/insights', getInsights);

module.exports = router;
