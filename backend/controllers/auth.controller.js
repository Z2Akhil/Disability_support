const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

const generateAuthToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      throw new ApiError(400, 'Email already in use');
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user',
    });

    await user.save();

    const token = generateAuthToken(user);
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await emailService.sendWelcomeEmail(user);
    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      user: user.toJSON(),
      accessToken: token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account is disabled');
    }

    const token = generateAuthToken(user);
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      user: user.toJSON(),
      accessToken: token,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const newToken = generateAuthToken(user);

    res.json({
      success: true,
      accessToken: newToken
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, 'Email not found');
    }

    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await emailService.sendPasswordChangedConfirmation(user.email);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -tokens -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'disabilityType', 'accessibilityPreferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new ApiError(400, 'Invalid updates');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (req.body.accessibilityPreferences && typeof req.body.accessibilityPreferences === 'string') {
      try {
        req.body.accessibilityPreferences = JSON.parse(req.body.accessibilityPreferences);
      } catch (e) {
        throw new ApiError(400, 'Invalid format for accessibilityPreferences');
      }
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    if (req.file) {
      user.profile = user.profile || {};
      user.profile.avatar = req.file.filename;
    }

    await user.save();

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};
