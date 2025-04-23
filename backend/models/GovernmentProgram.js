const mongoose = require('mongoose');
const { Schema } = mongoose;

const governmentProgramSchema = new Schema({
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
      'financial',
      'housing',
      'employment',
      'education',
      'healthcare',
      'transportation'
    ]
  },
  eligibilityCriteria: [{
    criterion: String,
    description: String
  }],
  benefits: [String],
  applicationProcess: {
    type: String,
    enum: ['online', 'mail', 'inPerson', 'phone'],
    required: true
  },
  applicationLink: String,
  requiredDocuments: [String],
  deadline: Date,
  isRecurring: Boolean,
  frequency: String,
  contact: {
    phone: String,
    email: String,
    website: String
  },
  managingAgency: String,
  languages: [String],
  accessibilityOptions: [String],
  lastUpdated: Date,
  popularity: {
    type: Number,
    default: 0
  },
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

// Indexes for search optimization
governmentProgramSchema.index({ title: 'text', description: 'text' });
governmentProgramSchema.index({ category: 1 });
governmentProgramSchema.index({ deadline: 1 });

// Pre-save hook for average rating
governmentProgramSchema.pre('save', function(next) {
  if (this.userRatings.length > 0) {
    this.averageRating = this.userRatings.reduce(
      (sum, rating) => sum + rating.rating, 0
    ) / this.userRatings.length;
  }
  next();
});

module.exports = mongoose.model('GovernmentProgram', governmentProgramSchema);