const Caregiver = require('../models/Caregiver');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

exports.getAllCaregivers = async (req, res, next) => {
  try {
    const { specialty, service, minRating } = req.query;
    const filter = {};
    
    if (specialty) filter.specialties = specialty;
    if (service) filter.services = service;
    if (minRating) filter.averageRating = { $gte: Number(minRating) };

    const caregivers = await Caregiver.find(filter)
      .populate('user', 'name avatar')
      .sort({ averageRating: -1 });

    res.json({
      success: true,
      count: caregivers.length,
      caregivers
    });
  } catch (error) {
    next(error);
  }
};

exports.getCaregiverById = async (req, res, next) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('ratings.user', 'name avatar');

    if (!caregiver) {
      throw new ApiError(404, 'Caregiver not found');
    }

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    
    // Check if user is a caregiver
    if (req.user.role !== 'caregiver') {
      throw new ApiError(403, 'Only caregivers can create profiles');
    }

    // Handle file upload if present
    if (req.file) {
      updates.certifications = updates.certifications || [];
      updates.certifications.push({
        name: 'Uploaded Certification',
        issuingOrganization: 'Uploaded',
        certificateFile: req.file.path
      });
    }

    const caregiver = await Caregiver.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const caregiver = await Caregiver.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!caregiver) {
      throw new ApiError(404, 'Caregiver profile not found');
    }

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const caregiver = await Caregiver.findOneAndUpdate(
      { user: req.user._id },
      { availability: req.body.availability },
      { new: true }
    );

    if (!caregiver) {
      throw new ApiError(404, 'Caregiver profile not found');
    }

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.addCertification = async (req, res, next) => {
  try {
    const { name, issuingOrganization, dateIssued } = req.body;
    const certification = {
      name,
      issuingOrganization,
      dateIssued: new Date(dateIssued),
      certificateFile: req.file?.path
    };

    const caregiver = await Caregiver.findOneAndUpdate(
      { user: req.user._id },
      { $push: { certifications: certification } },
      { new: true }
    );

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.addRating = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const ratingObj = {
      user: req.user._id,
      rating,
      review,
      date: new Date()
    };

    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { $push: { ratings: ratingObj } },
      { new: true }
    ).populate('ratings.user', 'name avatar');

    res.json({
      success: true,
      caregiver
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCaregiver = async (req, res, next) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { 
        backgroundCheck: {
          isVerified: true,
          verificationDate: new Date()
        }
      },
      { new: true }
    );

    if (!caregiver) {
      throw new ApiError(404, 'Caregiver not found');
    }

    // Notify caregiver via email
    const user = await User.findById(caregiver.user);
    await emailService.sendVerificationEmail(user.email, 'Caregiver');

    res.json({
      success: true,
      message: 'Caregiver verified successfully',
      caregiver
    });
  } catch (error) {
    next(error);
  }
};