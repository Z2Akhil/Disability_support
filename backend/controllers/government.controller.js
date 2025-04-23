const GovernmentProgram = require('../models/GovernmentProgram');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

exports.getAllPrograms = async (req, res, next) => {
  try {
    const { category, eligibility, sort } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (eligibility) {
      filter['eligibilityCriteria.criterion'] = { 
        $regex: eligibility, $options: 'i' 
      };
    }

    const sortOptions = sort === 'newest' 
      ? { createdAt: -1 } 
      : sort === 'popular' 
        ? { popularity: -1 } 
        : { title: 1 };

    const programs = await GovernmentProgram.find(filter)
      .sort(sortOptions);

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    next(error);
  }
};

exports.searchPrograms = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      throw new ApiError(400, 'Search query is required');
    }

    const programs = await GovernmentProgram.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgramsByCategory = async (req, res, next) => {
  try {
    const programs = await GovernmentProgram.find({
      category: req.params.category
    }).sort({ title: 1 });

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    next(error);
  }
};

exports.checkEligibility = async (req, res, next) => {
  try {
    const { criteria } = req.body;
    const programs = await GovernmentProgram.find({
      'eligibilityCriteria.criterion': { 
        $in: criteria.map(c => new RegExp(c, 'i')) 
      }
    });

    res.json({
      success: true,
      count: programs.length,
      programs
    });
  } catch (error) {
    next(error);
  }
};

exports.getProgramById = async (req, res, next) => {
  try {
    const program = await GovernmentProgram.findByIdAndUpdate(
      req.params.id,
      { $inc: { popularity: 1 } },
      { new: true }
    );

    if (!program) {
      throw new ApiError(404, 'Program not found');
    }

    res.json({
      success: true,
      program
    });
  } catch (error) {
    next(error);
  }
};

exports.saveProgramForUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedPrograms: req.params.id } },
      { new: true }
    );

    res.json({
      success: true,
      savedPrograms: user.savedPrograms
    });
  } catch (error) {
    next(error);
  }
};

exports.trackApplication = async (req, res, next) => {
  try {
    const program = await GovernmentProgram.findById(req.params.id);
    if (!program) {
      throw new ApiError(404, 'Program not found');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { 
          appliedPrograms: {
            program: req.params.id,
            appliedAt: new Date(),
            status: 'submitted'
          } 
        } 
      },
      { new: true }
    );

    // In a real app, you'd integrate with the actual application system
    logger.info(`User ${req.user._id} applied to program ${req.params.id}`);

    res.json({
      success: true,
      message: 'Application tracked successfully',
      application: user.appliedPrograms.find(
        app => app.program.toString() === req.params.id
      )
    });
  } catch (error) {
    next(error);
  }
};

exports.rateProgram = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const ratingObj = {
      userId: req.user._id,
      rating,
      review,
      date: new Date()
    };

    const program = await GovernmentProgram.findByIdAndUpdate(
      req.params.id,
      { $push: { userRatings: ratingObj } },
      { new: true }
    );

    res.json({
      success: true,
      program
    });
  } catch (error) {
    next(error);
  }
};

exports.createProgram = async (req, res, next) => {
  try {
    const program = new GovernmentProgram(req.body);
    await program.save();

    res.status(201).json({
      success: true,
      program
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const program = await GovernmentProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!program) {
      throw new ApiError(404, 'Program not found');
    }

    res.json({
      success: true,
      program
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await GovernmentProgram.findByIdAndDelete(req.params.id);

    if (!program) {
      throw new ApiError(404, 'Program not found');
    }

    // Remove references from users
    await User.updateMany(
      { savedPrograms: req.params.id },
      { $pull: { savedPrograms: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};