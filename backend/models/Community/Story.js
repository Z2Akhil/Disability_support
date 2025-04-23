const mongoose = require('mongoose');
const { Schema } = mongoose;

const storySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  disabilityType: {
    type: String,
    required: true,
    enum: ['physical', 'visual', 'hearing', 'cognitive', 'other']
  },
  topics: [{
    type: String,
    enum: ['education', 'employment', 'independence', 'technology', 'healthcare']
  }],
  media: {
    images: [{
      url: String,
      caption: String,
      altText: String
    }],
    videos: [{
      url: String,
      caption: String,
      hasCaptions: Boolean
    }]
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewerNotes: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
storySchema.index({ author: 1 });
storySchema.index({ disabilityType: 1 });
storySchema.index({ isFeatured: 1 });
storySchema.index({ createdAt: -1 });

// Virtuals
storySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Methods
storySchema.methods.incrementShare = function() {
  this.shares += 1;
  return this.save();
};

module.exports = mongoose.model('Story', storySchema);