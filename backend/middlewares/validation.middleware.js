const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

// Validate request
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    
    next(new ApiError(400, 'Validation failed', {
      errors: errors.array()
    }));
  };
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  // Trim all string inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  // Sanitize query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }
  
  next();
};

module.exports = {
  validate,
  sanitizeInput
};