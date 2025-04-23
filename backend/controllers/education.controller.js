const EducationResource = require('../models/Education');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

exports.getAllResources = async (req, res, next) => {
  try {
    const { category, disabilityType, cost } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (disabilityType) filter.disabilityTypes = disabilityType;
    if (cost) filter.cost = cost;

    const resources = await EducationResource.find(filter)
      .sort({ popularity: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await EducationResource.findByIdAndUpdate(
      req.params.id,
      { $inc: { popularity: 1 } },
      { new: true }
    );

    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

exports.getResourcesByCategory = async (req, res, next) => {
  try {
    const resources = await EducationResource.find({ 
      category: req.params.category 
    }).sort({ popularity: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.getResourcesByDisabilityType = async (req, res, next) => {
  try {
    const resources = await EducationResource.find({ 
      disabilityTypes: req.params.type 
    }).sort({ popularity: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const resource = new EducationResource(req.body);
    await resource.save();

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

exports.rateResource = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const ratingObj = {
      userId: req.user._id,
      rating,
      review,
      date: new Date()
    };

    const resource = await EducationResource.findByIdAndUpdate(
      req.params.id,
      { $push: { userRatings: ratingObj } },
      { new: true }
    );

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await EducationResource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await EducationResource.findByIdAndDelete(req.params.id);

    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};