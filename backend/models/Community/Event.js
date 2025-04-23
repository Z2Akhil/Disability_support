const mongoose = require('mongoose');
const { Schema } = mongoose;
const logger = require('../../utils/logger');

const eventSchema = new Schema({
  // Event basics
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // Event organizer (could be user or organization)
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerType: {
    type: String,
    enum: ['user', 'organization'],
    default: 'user'
  },
  
  // Event details
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  
  // Location (physical or virtual)
  locationType: {
    type: String,
    enum: ['physical', 'virtual', 'hybrid'],
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  onlineLink: {
    type: String,
    trim: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  
  // Accessibility features
  accessibilityFeatures: [{
    type: String,
    enum: [
      'wheelchair',
      'signLanguage',
      'closedCaptions',
      'audioDescription',
      'quietSpace',
      'accessibleRestrooms',
      'accessibleParking',
      'other'
    ]
  }],
  otherAccessibilityInfo: {
    type: String,
    trim: true
  },
  
  // Event categories
  categories: [{
    type: String,
    enum: [
      'social',
      'educational',
      'support',
      'workshop',
      'advocacy',
      'fundraiser',
      'sports',
      'arts',
      'health'
    ]
  }],
  
  // Media
  image: {
    url: String,
    altText: String,
    caption: String
  },
  
  // Registration
  isRegistrationRequired: {
    type: Boolean,
    default: false
  },
  registrationLink: {
    type: String,
    trim: true
  },
  maxAttendees: Number,
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendeeCount: {
    type: Number,
    default: 0
  },
  
  // Moderation
  isApproved: {
    type: Boolean,
    default: false
  },
  moderatorNotes: String,
  
  // Engagement
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// GeoJSON index for location searches
eventSchema.index({ coordinates: '2dsphere' });

// Indexes for better performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ categories: 1 });
eventSchema.index({ accessibilityFeatures: 1 });

// Middleware to update counts
eventSchema.pre('save', function(next) {
  this.attendeeCount = this.attendees.length;
  this.likeCount = this.likes.length;
  this.commentCount = this.comments.length;
  next();
});

// Virtual for organizer details
eventSchema.virtual('organizerDetails', {
  ref: 'User',
  localField: 'organizer',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name avatar role organization' }
});

// Static method for upcoming events
eventSchema.statics.findUpcoming = async function(limit = 10, filters = {}) {
  return await this.find({ 
    ...filters,
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 })
  .limit(limit)
  .populate('organizerDetails');
};

// Static method for events by accessibility
eventSchema.statics.findByAccessibility = async function(features, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return await this.find({ 
    accessibilityFeatures: { $all: features },
    startDate: { $gte: new Date() }
  })
  .sort({ startDate: 1 })
  .skip(skip)
  .limit(limit)
  .populate('organizerDetails');
};

// Instance method to add attendee
eventSchema.methods.addAttendee = async function(userId) {
  if (!this.attendees.includes(userId)) {
    this.attendees.push(userId);
    await this.save();
  }
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;