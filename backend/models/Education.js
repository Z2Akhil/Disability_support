const mongoose = require('mongoose');
const { Schema } = mongoose;

const educationResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'onlineCourse',
      'workshop',
      'scholarship',
      'trainingProgram',
      'resourceGuide'
    ]
  },
  disabilityTypes: [{
    type: String,
    enum: [
      'physical',
      'visual',
      'hearing',
      'cognitive',
      'learning',
      'mentalHealth'
    ]
  }],
  provider: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: String,
    enum: ['free', 'paid', 'scholarshipAvailable'],
    default: 'free'
  },
  accessibilityFeatures: [{
    type: String,
    enum: [
      'captions',
      'transcripts',
      'screenReaderCompatible',
      'signLanguage',
      'altText',
      'adjustableText'
    ]
  }],
  languages: [{
    type: String
  }],
  ageRange: {
    min: Number,
    max: Number
  },
  isCertified: Boolean,
  contactEmail: String,
  popularity: {
    type: Number,
    default: 0
  },
  lastUpdated: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
educationResourceSchema.index({ category: 1 });
educationResourceSchema.index({ disabilityTypes: 1 });
educationResourceSchema.index({ accessibilityFeatures: 1 });

// Methods
educationResourceSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  return this.save();
};

module.exports = mongoose.model('EducationResource', educationResourceSchema);