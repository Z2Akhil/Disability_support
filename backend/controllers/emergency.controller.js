const EmergencyService = require('../models/Emergency');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const notificationService = require('../services/notification.service');

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await EmergencyService.find({
      verificationStatus: 'verified'
    }).sort({ type: 1 });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyServices = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query; // Default 5km
    
    if (!longitude || !latitude) {
      throw new ApiError(400, 'Longitude and latitude are required');
    }

    const services = await EmergencyService.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      verificationStatus: 'verified'
    });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

exports.getServicesByType = async (req, res, next) => {
  try {
    const services = await EmergencyService.find({
      type: req.params.type,
      verificationStatus: 'verified'
    });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const service = await EmergencyService.findById(req.params.id);

    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.sendEmergencyAlert = async (req, res, next) => {
  try {
    const { userId, location, emergencyType } = req.body;
    
    // In a real app, this would trigger notifications to emergency contacts and services
    logger.warn(`EMERGENCY ALERT: User ${userId} needs ${emergencyType} help at ${location.coordinates}`);

    // Notify emergency contacts
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.contact.emergencyContact.phone) {
        await notificationService.sendEmergencySMS(
          user.contact.emergencyContact.phone,
          user.name,
          emergencyType
        );
      }
    }

    // Return nearest services
    const services = await EmergencyService.find({
      type: emergencyType,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates
          },
          $maxDistance: 10000 // 10km
        }
      },
      verificationStatus: 'verified'
    }).limit(3);

    res.json({
      success: true,
      message: 'Emergency alert received. Help is on the way.',
      services
    });
  } catch (error) {
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const service = new EmergencyService({
      ...req.body,
      submittedBy: req.user._id
    });

    await service.save();

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyService = async (req, res, next) => {
  try {
    const service = await EmergencyService.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus: 'verified',
        lastVerified: new Date()
      },
      { new: true }
    );

    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await EmergencyService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEmergencyProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        'contact.emergencyContact': req.body.emergencyContact 
      },
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