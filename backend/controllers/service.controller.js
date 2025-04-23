const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const notificationService = require('../services/notification.service');

exports.getAllServices = async (req, res, next) => {
  try {
    const { category, minRating, availability } = req.query;
    const filter = { isApproved: true };
    
    if (category) filter.category = category;
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (availability) filter.availability = availability;

    const services = await Service.find(filter)
      .populate('provider', 'name avatar')
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const services = await Service.find({
      category: req.params.category,
      isApproved: true
    }).populate('provider', 'name avatar');

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
    const { longitude, latitude, maxDistance = 10000 } = req.query;
    
    if (!longitude || !latitude) {
      throw new ApiError(400, 'Longitude and latitude are required');
    }

    const services = await Service.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isApproved: true
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

exports.searchServices = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      throw new ApiError(400, 'Search query is required');
    }

    const services = await Service.find(
      { $text: { $search: q }, isApproved: true },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

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
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name avatar')
      .populate('reviews.user', 'name avatar');

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

exports.requestService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    const request = new ServiceRequest({
      user: req.user._id,
      service: req.params.id,
      requestedDate: new Date(req.body.date),
      notes: req.body.notes,
      status: 'pending'
    });

    await request.save();

    // Notify service provider
    const provider = await User.findById(service.provider);
    if (provider) {
      await notificationService.sendServiceRequestNotification(
        provider.email,
        req.user.name,
        service.name
      );
    }

    res.status(201).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

exports.rateService = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const reviewObj = {
      user: req.user._id,
      rating,
      comment: review,
      date: new Date()
    };

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: reviewObj } },
      { new: true }
    );

    // Recalculate average rating
    const avgRating = service.reviews.reduce(
      (sum, review) => sum + review.rating, 0
    ) / service.reviews.length;

    service.rating = avgRating;
    await service.save();

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const service = new Service({
      ...req.body,
      provider: req.user._id
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

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new ApiError(404, 'Service not found or not authorized');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

exports.approveService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!service) {
      throw new ApiError(404, 'Service not found');
    }

    // Notify provider
    const provider = await User.findById(service.provider);
    if (provider) {
      await notificationService.sendServiceApprovalNotification(
        provider.email,
        service.name
      );
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};