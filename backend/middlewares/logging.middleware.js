const logger = require('../utils/logger');

// Detailed request logging
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      user: req.user?._id || 'anonymous',
      accessibility: req.accessibility
    });
  });

  next();
};

// Log important actions
const actionLogger = (actionType) => {
  return (req, res, next) => {
    logger.info({
      action: actionType,
      user: req.user?._id || 'anonymous',
      data: req.body,
      params: req.params
    });
    next();
  };
};

module.exports = {
  requestLogger,
  actionLogger
};