const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer');
const { check } = require('express-validator'); // ✅ Added

// Public route
router.post('/check-email', userController.checkEmailAvailability);

// Authenticated user routes
router.get(
  '/me',
  authMiddleware.authenticate,
  userController.getCurrentUser
);

router.patch(
  '/me',
  authMiddleware.authenticate,
  upload.single('avatar'),
  validate([
    check('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),

    check('disabilityType')
      .optional()
      .isIn([
        'physical',
        'visual',
        'hearing',
        'cognitive',
        'learning',
        'mentalHealth',
        'none',
      ])
      .withMessage('Invalid disability type'),

    check('accessibilityPreferences')
      .optional()
      .custom((value) => {
        try {
          JSON.parse(value);
          return true;
        } catch {
          throw new Error('Invalid accessibilityPreferences format');
        }
      }),
  ]),
  userController.updateCurrentUser
);

router.patch(
  '/me/password',
  authMiddleware.authenticate,
  validate([
    check('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    check('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ]),
  userController.changePassword
);

router.post(
  '/me/emergency-contact',
  authMiddleware.authenticate,
  validate([
    check('name').notEmpty(),
    check('relation').notEmpty(),
    check('phone').notEmpty(),
  ]),
  userController.updateEmergencyContact
);

// Admin routes
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  userController.getAllUsers
);

router.patch(
  '/:id/role',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  validate([
    check('role').isIn(['user', 'caregiver', 'provider', 'admin']),
  ]),
  userController.updateUserRole
);

router.patch(
  '/:id/status',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  validate([
    check('status').isIn(['active', 'suspended', 'deleted']),
  ]),
  userController.updateUserStatus
);

module.exports = router;
