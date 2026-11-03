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
} = require("../controllers/adminControllers");

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

module.exports = router;
