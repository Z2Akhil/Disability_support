const logger = require('../utils/logger');

// Track accessibility preferences
const trackAccessibility = (req, res, next) => {
  // Extract from headers or default
  req.accessibility = {
    highContrast: req.headers['x-high-contrast'] === 'true',
    fontSize: req.headers['x-font-size'] || 'medium',
    screenReader: req.headers['x-screen-reader'] === 'true'
  };
  
  logger.info(`Accessibility prefs: ${JSON.stringify(req.accessibility)}`);
  next();
};

// Check API access limits for disabled users
const checkAccessLimits = (req, res, next) => {
  if (req.user?.accessTier === 'limited') {
    const currentHour = new Date().getHours();
    if (currentHour < 6 || currentHour > 22) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted during these hours for your account tier'
      });
    }
  }
  next();
};

module.exports = {
  trackAccessibility,
  checkAccessLimits
};