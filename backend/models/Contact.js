const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    enum: [
      'general',
      'support',
      'feedback',
      'partnership',
      'accessibility'
    ]
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'spam'],
    default: 'new'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    createdBy: Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  response: {
    content: String,
    respondedBy: Schema.Types.ObjectId,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ subject: 1 });

module.exports = mongoose.model('Contact', contactSchema);