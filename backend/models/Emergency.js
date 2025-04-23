const mongoose = require('mongoose');
const { Schema } = mongoose;

const emergencyServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'police', 
      'medical', 
      'fire', 
      'disability', 
      'mentalHealth',
      'hotline'
    ]
  },
  contactNumbers: [{
    number: {
      type: String,
      required: true
    },
    description: String
  }],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  coverageArea: String,
  languages: [String],
  accessibilityFeatures: [{
    type: String,
    enum: [
      'tty',
      'signLanguage',
      'textRelay',
      'accessibleTransport',
      'wheelchairAccess'
    ]
  }],
  operatingHours: {
    from: String,
    to: String,
    timezone: String,
    is24x7: Boolean
  },
  description: String,
  additionalInfo: String,
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified'],
    default: 'unverified'
  },
  lastVerified: Date,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// GeoJSON index for location-based queries
emergencyServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyService', emergencyServiceSchema);