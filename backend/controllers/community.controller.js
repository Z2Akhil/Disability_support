const Post = require('../models/Community/Post');
const Event = require('../models/Community/Event');
const Story = require('../models/Community/Story');
const Comment = require('../models/Community/Comment');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Helper function for handling likes
const handleLike = async (model, id, userId) => {
  const content = await model.findById(id);
  if (!content) {
    throw new ApiError(404, 'Content not found');
  }

  const likeIndex = content.likes.indexOf(userId);
  if (likeIndex === -1) {
    content.likes.push(userId);
  } else {
    content.likes.splice(likeIndex, 1);
  }

  await content.save();
  return content.likes.length;
};

// Posts Controller
exports.getAllPosts = async (req, res, next) => {
  try {
    const { community, sortBy } = req.query;
    const filter = community ? { community } : {};
    const sort = sortBy === 'popular' ? { likeCount: -1 } : { createdAt: -1 };

    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .sort(sort);

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' }
      });

    if (!post) throw new ApiError(404, 'Post not found');
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const attachments = req.files?.map(file => ({
      url: file.path,
      type: file.mimetype.startsWith('image') ? 'image' : 
            file.mimetype.startsWith('video') ? 'video' : 'document',
      description: ''
    }));

    const post = new Post({
      title,
      content,
      tags,
      author: req.user._id,
      attachments,
      accessibility: {
        hasAltText: attachments?.every(att => att.type !== 'image' || att.description),
        isScreenReaderFriendly: true
      }
    });

    await post.save();
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const comment = new Comment({
      contentId: req.params.postId,
      contentType: 'post',
      author: req.user._id,
      text: req.body.content
    });

    await comment.save();
    await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { comments: comment._id } }
    );

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// Events Controller
exports.getAllEvents = async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const filter = upcoming === 'true' ? { startDate: { $gte: new Date() } } : {};
    
    const events = await Event.find(filter)
      .populate('organizer', 'name avatar')
      .sort({ startDate: 1 });

    res.json({ success: true, count: events.length, events });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name avatar');

    if (!event) throw new ApiError(404, 'Event not found');
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user._id
    });

    await event.save();
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

exports.rsvpToEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $addToSet: { attendees: req.user._id } },
      { new: true }
    );

    if (!event) throw new ApiError(404, 'Event not found');
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// Stories Controller
exports.getAllStories = async (req, res, next) => {
  try {
    const { disabilityType, isFeatured } = req.query;
    const filter = {};
    
    if (disabilityType) filter.disabilityType = disabilityType;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    const stories = await Story.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: stories.length, stories });
  } catch (error) {
    next(error);
  }
};

exports.getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('author', 'name avatar');

    if (!story) throw new ApiError(404, 'Story not found');
    res.json({ success: true, story });
  } catch (error) {
    next(error);
  }
};

exports.createStory = async (req, res, next) => {
  try {
    const { title, content, disabilityType, topics } = req.body;
    const media = req.files?.map(file => ({
      url: file.path,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      caption: '',
      ...(file.mimetype.startsWith('image') ? { altText: '' } : { hasCaptions: false })
    }));

    const story = new Story({
      title,
      content,
      disabilityType,
      topics,
      media,
      author: req.user._id
    });

    await story.save();
    res.status(201).json({ success: true, story });
  } catch (error) {
    next(error);
  }
};

// Like Controller
exports.toggleLike = async (req, res, next) => {
  try {
    const modelMap = {
      'posts': Post,
      'events': Event,
      'stories': Story
    };

    const pathParts = req.path.split('/');
    const contentType = pathParts[1]; // posts, events, or stories
    const model = modelMap[contentType];

    if (!model) throw new ApiError(400, 'Invalid content type');

    const likesCount = await handleLike(
      model,
      req.params[`${contentType.slice(0, -1)}Id`],
      req.user._id
    );

    res.json({ success: true, likes: likesCount });
  } catch (error) {
    next(error);
  }
};

// Moderation Controller
exports.updatePostStatus = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { status: req.body.status },
      { new: true }
    );

    if (!post) throw new ApiError(404, 'Post not found');
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};