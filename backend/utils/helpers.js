const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const constants = require('./constants');
require('dotenv').config();

module.exports = {
  // Generate JWT tokens
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: user.userType
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  },

  // Password hashing
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Generate random strings
  generateRandomString: (length = 10) => {
    return uuidv4().replace(/-/g, '').substring(0, length);
  },

  // Generate verification code
  generateVerificationCode: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Pagination helper
  paginate: (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
  },

  // Format response
  formatResponse: (data, message = '', success = true) => {
    return {
      success,
      message,
      data
    };
  },

  // Error handler
  errorHandler: (error) => {
    console.error(error);
    return {
      success: false,
      message: error.message || constants.ERROR_MESSAGES.SERVER_ERROR,
      data: null
    };
  },

  // Accessibility helpers
  applyAccessibilitySettings: (userSettings, data) => {
    if (userSettings?.highContrast) {
      data.highContrast = true;
    }
    if (userSettings?.fontSize) {
      data.fontSize = userSettings.fontSize;
    }
    return data;
  },

  // Generate unique ID for resources
  generateResourceId: (prefix = '') => {
    return `${prefix}${uuidv4()}`;
  }
};