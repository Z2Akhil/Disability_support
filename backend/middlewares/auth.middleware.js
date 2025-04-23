const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// ✅ Simplified authentication — No DB token check
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔐 Incoming token:', token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id); // ✅ Removed token array check

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    logger.error('Authentication failed:', err.message);
    res.status(401).json({
      success: false,
      message: 'Please authenticate'
    });
  }
};

// Role-based access control
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user._id} to ${req.path}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    next();
  };
};

// Check if user is disabled
const checkUserStatus = (req, res, next) => {
  if (req.user.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Account is disabled. Please contact support.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  checkUserStatus
};
