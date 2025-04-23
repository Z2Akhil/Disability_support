const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const healthcareController = require('../controllers/healthcare.controller');
const { validate } = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// ------------------ PUBLIC ROUTES ------------------ //

router.get('/', healthcareController.getAllProviders);

router.get('/search', healthcareController.searchProviders);

router.get('/specialty/:specialtyId', healthcareController.getBySpecialty);

router.get('/nearby', healthcareController.getNearbyProviders);

// ⚠️ Keep this last to avoid conflicts with other dynamic routes
router.get('/:providerId', healthcareController.getProviderById);


// ------------------ AUTHENTICATED USER ROUTES ------------------ //

router.post('/:providerId/appointments',
  authMiddleware.authenticate,
  validate([
    check('date').isISO8601().toDate(),
    check('reason').notEmpty().trim().isLength({ max: 500 }),
    check('notes').optional().trim().isLength({ max: 1000 })
  ]),
  healthcareController.bookAppointment
);

router.post('/:providerId/ratings',
  authMiddleware.authenticate,
  validate([
    check('rating').isFloat({ min: 1, max: 5 }),
    check('review').optional().trim().isLength({ max: 1000 })
  ]),
  healthcareController.rateProvider
);


// ------------------ PROVIDER ROUTES ------------------ //

router.post('/providers/profile',
  authMiddleware.authenticate,
  authMiddleware.authorize(['provider']),
  validate([
    check('name').notEmpty().trim().isLength({ max: 100 }),
    check('type').isIn(['hospital', 'clinic', 'specialist', 'therapist', 'pharmacy', 'lab']),
    check('specialties').isArray({ min: 1 }),
    check('specialties.*').isString().trim().notEmpty()
  ]),
  healthcareController.createOrUpdateProfile
);


// ------------------ ADMIN ROUTES ------------------ //

router.patch('/providers/:providerId/verification',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  healthcareController.verifyProvider
);

module.exports = router;
