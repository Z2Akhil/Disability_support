const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

exports.checkEmailAvailability = async (req, res, next) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email });
    
    res.json({
      success: true,
      available: !exists
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

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        disabilityType: user.disabilityType,
        accessibilityPreferences: user.accessibilityPreferences,
        profile: user.profile || {}, // ✅ ensure profile (with avatar) is sent
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name',
      'email', 
      'disabilityType',
       'accessibilityPreferences'
     ];

    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new ApiError(400, 'Invalid updates');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // ✅ Parse JSON if accessibilityPreferences was sent as string (FormData)
    if (typeof req.body.accessibilityPreferences === 'string') {
      req.body.accessibilityPreferences = JSON.parse(req.body.accessibilityPreferences);
    }

    // ✅ Handle avatar file upload and assign to profile.avatar
    if (req.file) {
      user.profile = user.profile || {}; // Ensure profile object exists
      user.profile.avatar = req.file.filename; // Save only the filename
    }

    // ✅ Apply all other allowed updates from body
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    console.log('✅ Final updated user:', user);
    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    // Send password change confirmation
    await emailService.sendPasswordChangedConfirmation(user.email);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmergencyContact = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'contact.emergencyContact': req.body },
      { new: true }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Admin functions
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select('-password -tokens -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Notify user of role change
    await emailService.sendRoleChangeNotification(user.email, req.body.role);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Notify user of status change
    if (req.body.status === 'suspended') {
      await emailService.sendAccountSuspendedNotification(user.email);
    } else if (req.body.status === 'active') {
      await emailService.sendAccountReactivatedNotification(user.email);
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};