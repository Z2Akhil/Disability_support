const { body, param, query } = require('express-validator');
const constants = require('./constants');

module.exports = {
  // Auth validators
  registerValidator: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2-50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .matches(constants.REGEX.EMAIL)
      .withMessage('Invalid email format'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(constants.REGEX.PASSWORD)
      .withMessage('Password must contain at least one uppercase, one lowercase, one number and one special character'),
    body('userType')
      .optional()
      .isIn([constants.USER_TYPES.USER, constants.USER_TYPES.CAREGIVER])
      .withMessage('Invalid user type')
  ],

  loginValidator: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],

  // User validators
  updateUserValidator: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2-50 characters'),
    body('phone')
      .optional()
      .trim()
      .matches(constants.REGEX.PHONE)
      .withMessage('Invalid phone number format'),
    body('address.zipCode')
      .optional()
      .trim()
      .matches(constants.REGEX.ZIP_CODE)
      .withMessage('Invalid zip code format')
  ],

  // Service validators
  serviceValidator: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title must be less than 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isIn(constants.SERVICE_CATEGORIES)
      .withMessage('Invalid service category'),
    body('location.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]')
  ],

  // Healthcare validators
  healthcareValidator: [
    body('specialty')
      .trim()
      .notEmpty()
      .withMessage('Specialty is required')
      .isIn(constants.HEALTHCARE_SPECIALTIES)
      .withMessage('Invalid healthcare specialty'),
    body('telemedicineAvailable')
      .optional()
      .isBoolean()
      .withMessage('Telemedicine availability must be a boolean')
  ],

  // Education validators
  educationValidator: [
    body('programType')
      .trim()
      .notEmpty()
      .withMessage('Program type is required')
      .isIn(constants.EDUCATION_TYPES)
      .withMessage('Invalid education program type'),
    body('duration')
      .trim()
      .notEmpty()
      .withMessage('Duration is required')
  ],

  // Community validators
  postValidator: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 5000 })
      .withMessage('Content must be less than 5000 characters'),
    body('type')
      .trim()
      .notEmpty()
      .withMessage('Post type is required')
      .isIn(constants.POST_TYPES)
      .withMessage('Invalid post type')
  ],

  // Common validators
  idValidator: [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('ID is required')
      .isMongoId()
      .withMessage('Invalid ID format')
  ],

  paginationValidator: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: constants.PAGINATION.MAX_LIMIT })
      .withMessage(`Limit must be between 1-${constants.PAGINATION.MAX_LIMIT}`)
      .toInt()
  ],

  // File upload validators
  fileUploadValidator: [
    body('fileType')
      .optional()
      .isIn(['image', 'document', 'audio', 'video'])
      .withMessage('Invalid file type'),
    body('maxSize')
      .optional()
      .isInt({ min: 1, max: 10 * 1024 * 1024 }) // 10MB max
      .withMessage('Max size must be between 1 byte and 10MB')
  ],

  // Emergency contact validator
  emergencyContactValidator: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone is required')
      .matches(constants.REGEX.PHONE)
      .withMessage('Invalid phone number format'),
    body('type')
      .trim()
      .notEmpty()
      .withMessage('Type is required')
      .isIn(constants.EMERGENCY_CONTACT_TYPES)
      .withMessage('Invalid emergency contact type')
  ]
};