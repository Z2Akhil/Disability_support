const mongoose = require('mongoose');
const { Schema } = mongoose;
const logger = require('../../utils/logger');

const commentSchema = new Schema({
  // Reference to the content being commented on (post, event, etc.)
  contentId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['post', 'event', 'resource'],
    default: 'post'
  },
  
  // Comment author (reference to User model)
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Comment content
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // Accessibility features
  hasImageDescription: {
    type: Boolean,
    default: false
  },
  imageDescription: {
    type: String,
    trim: true
  },
  
  // Moderation
  isReported: {
    type: Boolean,
    default: false
  },
  reports: [{
    userId: Schema.Types.ObjectId,
    reason: String,
    createdAt: Date
  }],
  
  // Engagement metrics
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  
  // Nested comments (for replies)
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  replyCount: {
    type: Number,
    default: 0
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
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

// Indexes for better performance
commentSchema.index({ contentId: 1, contentType: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ createdAt: -1 });

// Middleware to update like count
commentSchema.pre('save', function(next) {
  this.likeCount = this.likes.length;
  this.replyCount = this.replies.length;
  next();
});

// Virtual for author details (to avoid population in some cases)
commentSchema.virtual('authorDetails', {
  ref: 'User',
  localField: 'author',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name avatar role accessibilityPrefs' }
});

// Static method for paginated comments
commentSchema.statics.findByContent = async function(contentId, contentType, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return await this.find({ contentId, contentType })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('authorDetails')
    .populate({
      path: 'replies',
      options: { limit: 3, sort: { createdAt: -1 } },
      populate: { path: 'authorDetails' }
    });
};

// Instance method to add reply
commentSchema.methods.addReply = async function(replyId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
    await this.save();
  }
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;