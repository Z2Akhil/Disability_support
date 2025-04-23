const mongoose = require('mongoose');
const { Schema } = mongoose;

const caregiverSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialties: [{
    type: String,
    enum: [
      'elderly', 
      'physicalDisabilities',
      'developmentalDisabilities',
      'cognitiveDisabilities',
      'terminalIllness'
    ]
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    dateIssued: Date,
    expiryDate: Date
  }],
  experienceYears: {
    type: Number,
    min: 0
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'on-call']
  },
  services: [{
    type: String,
    enum: [
      'personalCare',
      'mobilityAssistance',
      'medicationManagement',
      'mealPreparation',
      'companionship'
    ]
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  languages: [{
    type: String
  }],
  backgroundCheck: {
    isVerified: Boolean,
    verificationDate: Date
  },
  ratings: [{
    user: Schema.Types.ObjectId,
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
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
caregiverSchema.index({ specialties: 1 });
caregiverSchema.index({ services: 1 });
caregiverSchema.index({ 'availability': 1 });

// Pre-save hook for average rating
caregiverSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Caregiver', caregiverSchema);