const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },

  role: {
    type: String,
    enum: ['user', 'caregiver', 'admin', 'provider'],
    default: 'user'
  },

  disabilityType: {
    type: String,
    enum: [
      'physical',
      'visual',
      'hearing',
      'cognitive',
      'learning',
      'mentalHealth',
      'none'
    ]
  },

  accessibilityPreferences: {
    highContrast: { type: Boolean, default: false },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    screenReader: { type: Boolean, default: false },
    reducedMotion: { type: Boolean, default: false }
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // Default to avoid missing location errors
    }
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
    emergencyContact: {
      name: String,
      relation: String,
      phone: String
    }
  },

  profile: {
    bio: String,
    avatar: String,
    interests: [String]
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  lastLogin: Date,

  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },

  loginHistory: [{
    ipAddress: String,
    device: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  }
});

// 🔐 Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🌍 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
