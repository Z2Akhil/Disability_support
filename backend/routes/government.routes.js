const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const govController = require('../controllers/government.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', govController.getAllPrograms);
router.get('/search', govController.searchPrograms);
router.get('/category/:category', govController.getProgramsByCategory);
router.get('/eligibility-check', govController.checkEligibility);
router.get('/:id', govController.getProgramById);

// Authenticated routes
router.post('/:id/save',
  authMiddleware.authenticate,
  govController.saveProgramForUser
);

router.post('/:id/apply',
  authMiddleware.authenticate,
  govController.trackApplication
);

router.post('/:id/rate',
  authMiddleware.authenticate,
  validate([
    check('rating').isInt({ min: 1, max: 5 }),
    check('review').optional().trim()
  ]),
  govController.rateProgram
);

// Admin routes
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  validate([
    check('title').notEmpty().trim(),
    check('description').notEmpty().trim(),
    check('category').isIn(['financial', 'housing', 'employment', 'education', 'healthcare', 'transportation']),
    check('applicationProcess').isIn(['online', 'mail', 'inPerson', 'phone'])
  ]),
  govController.createProgram
);

router.patch('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  govController.updateProgram
);

router.delete('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  govController.deleteProgram
);

module.exports = router;