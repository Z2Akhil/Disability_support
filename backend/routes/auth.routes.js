const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');
const { check } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');

// Authentication routes
router.post('/register', 
  rateLimit.authLimiter,
  validate([
    check('name').notEmpty().trim().isLength({ min: 2 }),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 }),
    check('role').isIn(['user', 'caregiver'])
  ]),
  authController.register
);

router.post('/login',
  rateLimit.authLimiter,
  validate([
    check('email').isEmail().normalizeEmail(),
    check('password').exists()
  ]),
  authController.login
);

router.post('/logout',
  authMiddleware.authenticate,
  authController.logout
);

router.post('/logout-all',
  authMiddleware.authenticate,
  authController.logoutAll
);

router.post('/refresh-token',
  authController.refreshToken
);

router.post('/forgot-password',
  rateLimit.authLimiter,
  validate([check('email').isEmail().normalizeEmail()]),
  authController.forgotPassword
);

router.post('/reset-password',
  rateLimit.authLimiter,
  validate([
    check('token').notEmpty(),
    check('password').isLength({ min: 8 })
  ]),
  authController.resetPassword
);

router.get('/me',
  authMiddleware.authenticate,
  authController.getCurrentUser
);

router.patch('/me',
  authMiddleware.authenticate,
  validate([
    check('name').optional().trim().isLength({ min: 2 }),
    check('email').optional().isEmail().normalizeEmail(),
    check('password').optional().isLength({ min: 8 })
  ]),
  authController.updateCurrentUser
);

module.exports = router;