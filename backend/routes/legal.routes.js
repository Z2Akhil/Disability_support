const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const legalController = require('../controllers/legal.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', legalController.getAllResources);
router.get('/category/:category', legalController.getByCategory);
router.get('/jurisdiction/:jurisdiction', legalController.getByJurisdiction);
router.get('/search', legalController.searchResources);
router.get('/:id', legalController.getResourceById);

// Authenticated routes
router.post('/:id/save',
  authMiddleware.authenticate,
  legalController.saveResource
);

router.post('/ask-lawyer',
  authMiddleware.authenticate,
  validate([
    check('question').notEmpty().trim().isLength({ max: 1000 }),
    check('category').isIn(['discrimination', 'employment', 'education', 'housing', 'accessibility', 'benefits'])
  ]),
  legalController.askLawyerQuestion
);

// Admin routes
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'lawyer']),
  validate([
    check('title').notEmpty().trim(),
    check('description').notEmpty().trim(),
    check('category').isIn(['discrimination', 'employment', 'education', 'housing', 'accessibility', 'benefits']),
    check('jurisdiction').notEmpty()
  ]),
  legalController.createResource
);

router.patch('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'lawyer']),
  legalController.updateResource
);

module.exports = router;