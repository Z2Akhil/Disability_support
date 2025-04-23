const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const caregiverController = require('../controllers/caregiver.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer');
const { validate } = require('../middlewares/validation.middleware');

// Public routes
router.get('/', caregiverController.getAllCaregivers);

// Protected routes
router.post('/profile',
  authMiddleware.authenticate,
  authMiddleware.authorize(['caregiver']),
  upload.single('certification'),
  validate([
    check('specialties').optional().isArray(),
    check('experienceYears').optional().isInt({ min: 0 }),
    check('hourlyRate').optional().isFloat({ min: 0 })
  ]),
  caregiverController.createOrUpdateProfile
);

router.get('/profile/me',
  authMiddleware.authenticate,
  authMiddleware.authorize(['caregiver']),
  caregiverController.getMyProfile
);

router.get('/:id', caregiverController.getCaregiverById);

router.patch('/availability',
  authMiddleware.authenticate,
  authMiddleware.authorize(['caregiver']),
  validate([
    check('availability').isIn(['full-time', 'part-time', 'on-call'])
  ]),
  caregiverController.updateAvailability
);

router.post('/certifications',
  authMiddleware.authenticate,
  authMiddleware.authorize(['caregiver']),
  upload.single('certificateFile'),
  validate([
    check('name').notEmpty(),
    check('issuingOrganization').notEmpty(),
    check('dateIssued').isDate()
  ]),
  caregiverController.addCertification
);

router.post('/:id/ratings',
  authMiddleware.authenticate,
  validate([
    check('rating').isInt({ min: 1, max: 5 }),
    check('review').optional().trim()
  ]),
  caregiverController.addRating
);

// Admin routes
router.patch('/:id/verify',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin']),
  caregiverController.verifyCaregiver
);

module.exports = router;