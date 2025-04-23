const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const serviceController = require('../controllers/service.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getByCategory);
router.get('/nearby', serviceController.getNearbyServices);
router.get('/search', serviceController.searchServices);
router.get('/:id', serviceController.getServiceById);

// Authenticated routes
router.post('/:id/request',
  authMiddleware.authenticate,
  validate([
    check('date').isISO8601(),
    check('notes').optional().trim()
  ]),
  serviceController.requestService
);

router.post('/:id/rate',
  authMiddleware.authenticate,
  validate([
    check('rating').isInt({ min: 1, max: 5 }),
    check('review').optional().trim()
  ]),
  serviceController.rateService
);

// Provider routes
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['provider']),
  upload.array('documents', 3),
  validate([
    check('name').notEmpty().trim(),
    check('description').notEmpty().trim(),
    check('category').isIn(['transportation', 'homeCare', 'equipment', 'therapy', 'training', 'supportGroup']),
    check('cost').isIn(['free', 'slidingScale', 'paid', 'insurance'])
  ]),
  serviceController.createService
);

router.patch('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['provider', 'admin']),
  serviceController.updateService
);

// Admin routes
router.patch('/:id/approve',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  serviceController.approveService
);

module.exports = router;