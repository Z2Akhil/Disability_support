const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const emergencyController = require('../controllers/emergency.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Public emergency routes
router.get('/', emergencyController.getAllServices);
router.get('/nearby', emergencyController.getNearbyServices);
router.get('/types/:type', emergencyController.getServicesByType);
router.get('/:id', emergencyController.getServiceById);

// Emergency contact routes (no auth needed)
router.post('/alert',
  validate([
    check('userId').optional().isMongoId(),
    check('location.coordinates').isArray({ min: 2, max: 2 }),
    check('emergencyType').isIn(['medical', 'police', 'fire', 'disability'])
  ]),
  emergencyController.sendEmergencyAlert
);

// Authenticated routes
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'provider']),
  validate([
    check('name').notEmpty().trim(),
    check('type').isIn(['police', 'medical', 'fire', 'disability', 'mentalHealth', 'hotline']),
    check('contactNumbers').isArray({ min: 1 })
  ]),
  emergencyController.createService
);

//Admin routes
router.patch('/:id/verify',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  emergencyController.verifyService
);

router.patch('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  emergencyController.updateService
);

// User emergency profile
router.post('/profile',
  authMiddleware.authenticate,
  validate([
    check('emergencyContact.name').notEmpty(),
    check('emergencyContact.relation').notEmpty(),
    check('emergencyContact.phone').notEmpty()
  ]),
  emergencyController.updateEmergencyProfile
);

module.exports = router;