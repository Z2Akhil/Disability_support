const mongoose = require('mongoose');
const { Schema } = mongoose;

const legalResourceSchema = new Schema({
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
      'discrimination',
      'employment',
      'education',
      'housing',
      'accessibility',
      'benefits'
    ]
  },
  jurisdiction: {
    type: String,
    required: true
  },
  applicableLaws: [String],
  rightsProtected: [String],
  filingProcess: String,
  deadlines: String,
  requiredDocuments: [String],
  contact: {
    organization: String,
    phone: String,
    email: String,
    website: String
  },
  cost: {
    type: String,
    enum: ['free', 'slidingScale', 'paid', 'proBono']
  },
  languages: [String],
  accessibilityOptions: [String],
  forms: [{
    name: String,
    url: String,
    format: String
  }],
  lastUpdated: Date,
  isProBonoAvailable: Boolean,
  proBonoDetails: String,
  userRatings: [{
    userId: Schema.Types.ObjectId,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
legalResourceSchema.index({ title: 'text', description: 'text' });
legalResourceSchema.index({ category: 1 });
legalResourceSchema.index({ jurisdiction: 1 });

module.exports = mongoose.model('LegalResource', legalResourceSchema);