const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const educationController = require('../controllers/education.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', educationController.getAllResources);
router.get('/category/:category', educationController.getResourcesByCategory);
router.get('/disability/:type', educationController.getResourcesByDisabilityType);
router.get('/:id', educationController.getResourceById);

// Authenticated routes
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'provider']),
  validate([
    check('title').notEmpty().trim(),
    check('description').notEmpty().trim(),
    check('category').isIn(['onlineCourse', 'workshop', 'scholarship', 'trainingProgram', 'resourceGuide']),
    check('url').isURL(),
    check('cost').isIn(['free', 'paid', 'scholarshipAvailable'])
  ]),
  educationController.createResource
);

router.post('/:id/rate',
  authMiddleware.authenticate,
  validate([
    check('rating').isInt({ min: 1, max: 5 }),
    check('review').optional().trim()
  ]),
  educationController.rateResource
);

// Admin routes
router.patch('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  educationController.updateResource
);

router.delete('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  educationController.deleteResource
);

module.exports = router;