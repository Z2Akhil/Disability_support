const logger = require('../utils/logger');
const { ValidationError } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Custom error class
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// Error converter (normalize errors)
const errorConverter = (err, req, res, next) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false);
  }
  next(error);
};

// Error handler
const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode || 500).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// 404 handler
const notFound = (req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
};

module.exports = {
  ApiError,
  errorConverter,
  errorHandler,
  notFound
};