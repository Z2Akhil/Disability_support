const LegalResource = require('../models/LegalResource');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

exports.getAllResources = async (req, res, next) => {
  try {
    const { category, jurisdiction } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (jurisdiction) filter.jurisdiction = jurisdiction;

    const resources = await LegalResource.find(filter)
      .sort({ averageRating: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const resources = await LegalResource.find({
      category: req.params.category
    }).sort({ title: 1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.getByJurisdiction = async (req, res, next) => {
  try {
    const resources = await LegalResource.find({
      jurisdiction: req.params.jurisdiction
    }).sort({ title: 1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

exports.searchResources = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      throw new ApiError(400, 'Search query is required');
    }

    const resources = await LegalResource.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

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
    const resource = await LegalResource.findByIdAndUpdate(
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

exports.saveResource = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedLegalResources: req.params.id } },
      { new: true }
    );

    res.json({
      success: true,
      savedResources: user.savedLegalResources
    });
  } catch (error) {
    next(error);
  }
};

exports.askLawyerQuestion = async (req, res, next) => {
  try {
    const { question, category } = req.body;
    
    // In a real app, this would connect to a lawyer matching service
    logger.info(`Legal question from ${req.user._id}: ${question}`);

    // Save question to user's profile
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { legalQuestions: { question, category, askedAt: new Date() } } }
    );

    // Notify admin/lawyer team
    await emailService.notifyLegalTeam(req.user.email, question, category);

    res.json({
      success: true,
      message: 'Your question has been submitted. A legal professional will contact you soon.'
    });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const resource = new LegalResource({
      ...req.body,
      createdBy: req.user._id
    });

    await resource.save();

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resource = await LegalResource.findByIdAndUpdate(
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