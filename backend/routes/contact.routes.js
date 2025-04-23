const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contactController = require('../controllers/contact.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Public contact form submission
router.post('/',
  validate([
    check('name').notEmpty().trim(),
    check('email').isEmail().normalizeEmail(),
    check('subject').isIn(['general', 'support', 'feedback', 'partnership', 'accessibility']),
    check('message').notEmpty().trim().isLength({ max: 2000 })
  ]),
  contactController.submitContactForm
);

// Authenticated routes (for support team)
router.get('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'support']),
  contactController.getAllContacts
);


router.patch('/:id/status',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'support']),
  validate([
    check('status').isIn(['new', 'in-progress', 'resolved', 'spam'])
  ]),
  contactController.updateContactStatus
);

router.post('/:id/notes',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'support']),
  validate([
    check('content').notEmpty().trim()
  ]),
  contactController.addNote
);

router.post('/:id/response',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'support']),
  validate([
    check('content').notEmpty().trim()
  ]),
  contactController.addResponse
);

router.get('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'support']),
  contactController.getContactById
);

module.exports = router;