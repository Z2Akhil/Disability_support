const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  tags: [{
    type: String,
    enum: ['question', 'discussion', 'support', 'resource', 'announcement']
  }],
  accessibility: {
    hasAltText: Boolean,
    altText: String,
    isScreenReaderFriendly: Boolean
  },
  attachments: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    description: String
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'reported'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
postSchema.index({ author: 1 });
postSchema.index({ community: 1 });
postSchema.index({ createdAt: -1 });

// Virtuals
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Pre-save hook for accessibility
postSchema.pre('save', function(next) {
  if (this.attachments.some(att => att.type === 'image')) {
    this.accessibility.hasAltText = this.attachments.every(
      att => att.type !== 'image' || att.description
    );
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);