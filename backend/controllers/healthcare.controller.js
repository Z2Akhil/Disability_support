const HealthcareProvider = require('../models/Healthcare');
const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const notificationService = require('../services/notification.service');

exports.getAllProviders = async (req, res, next) => {
  try {
    const { specialty, acceptsInsurance, telehealth } = req.query;
    const filter = {};

    if (specialty) filter.specialties = specialty;
    if (acceptsInsurance) filter.insuranceAccepted = { $exists: true, $ne: [] };
    if (telehealth) filter.isTelehealthAvailable = true;

    const providers = await HealthcareProvider.find(filter)
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
};

exports.searchProviders = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      throw new ApiError(400, 'Search query is required');
    }

    const providers = await HealthcareProvider.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
};

exports.getBySpecialty = async (req, res, next) => {
  try {
    const providers = await HealthcareProvider.find({
      specialties: req.params.specialty
    }).sort({ rating: -1 });

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyProviders = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    
    if (!longitude || !latitude) {
      throw new ApiError(400, 'Longitude and latitude are required');
    }

    const providers = await HealthcareProvider.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    next(error);
  }
};

exports.getProviderById = async (req, res, next) => {
  try {
    const provider = await HealthcareProvider.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

exports.bookAppointment = async (req, res, next) => {
  try {
    const provider = await HealthcareProvider.findById(req.params.id);
    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    const appointment = new Appointment({
      user: req.user._id,
      provider: req.params.id,
      date: new Date(req.body.date),
      reason: req.body.reason,
      notes: req.body.notes,
      status: 'confirmed'
    });

    await appointment.save();

    // Notify provider
    await notificationService.sendAppointmentNotification(
      provider.contact.email,
      req.user.name,
      appointment.date
    );

    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.rateProvider = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const reviewObj = {
      user: req.user._id,
      rating,
      comment: review,
      date: new Date()
    };

    const provider = await HealthcareProvider.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: reviewObj } },
      { new: true }
    );

    // Recalculate average rating
    const avgRating = provider.reviews.reduce(
      (sum, review) => sum + review.rating, 0
    ) / provider.reviews.length;

    provider.rating = avgRating;
    await provider.save();

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const provider = await HealthcareProvider.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyProvider = async (req, res, next) => {
  try {
    const provider = await HealthcareProvider.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus: 'verified',
        lastVerified: new Date() 
      },
      { new: true }
    );

    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};