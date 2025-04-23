const mongoose = require('mongoose');
const { Schema } = mongoose;

const healthcareProviderSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'hospital',
      'clinic',
      'specialist',
      'therapist',
      'pharmacy',
      'lab'
    ]
  },
  specialties: [String],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  accessibilityFeatures: [{
    type: String,
    enum: [
      'wheelchairRamp',
      'accessibleRestrooms',
      'elevators',
      'signLanguage',
      'braille',
      'wideDoorways'
    ]
  }], // ← This was missing the closing bracket
  insuranceAccepted: [String],
  acceptsMedicaid: Boolean,
  languages: [String],
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  isTelehealthAvailable: Boolean,
  telehealthOptions: [String],
  staff: [{
    name: String,
    role: String,
    specialty: String
  }],
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
  lastVerified: Date
}, {
  timestamps: true
});

// GeoJSON index for location queries
healthcareProviderSchema.index({ location: '2dsphere' });

// Text index for search
healthcareProviderSchema.index({ name: 'text', specialties: 'text' });

module.exports = mongoose.model('HealthcareProvider', healthcareProviderSchema);
