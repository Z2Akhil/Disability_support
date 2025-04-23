const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: {
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
      'transportation',
      'homeCare',
      'equipment',
      'therapy',
      'training',
      'supportGroup'
    ]
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  serviceArea: [String],
  accessibilityFeatures: [String],
  cost: {
    type: String,
    enum: ['free', 'slidingScale', 'paid', 'insurance']
  },
  availability: {
    type: String,
    enum: ['immediate', 'waitlist', 'scheduled']
  },
  languages: [String],
  certification: {
    isCertified: Boolean,
    certifyingBody: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    userId: Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    name: String,
    url: String,
    description: String
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// GeoJSON index for location-based queries
serviceSchema.index({ location: '2dsphere' });

// Text index for search
serviceSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Service', serviceSchema);