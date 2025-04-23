const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../config/multer');
const { validate } = require('../middlewares/validation.middleware');

// =================== Public Routes ===================
router.get('/posts', communityController.getAllPosts);
router.get('/posts/:postId', communityController.getPostById);
router.get('/events', communityController.getAllEvents);
router.get('/events/:eventId', communityController.getEventById);
router.get('/stories', communityController.getAllStories);
router.get('/stories/:storyId', communityController.getStoryById);

// =================== Authenticated Routes ===================
router.post(
  '/posts',
  authMiddleware.authenticate,
  upload.array('attachments', 3),
  validate([
    check('title').notEmpty().trim().isLength({ min: 5, max: 120 }),
    check('content').notEmpty().trim().isLength({ min: 10, max: 5000 }),
    check('type').isIn(['discussion', 'question', 'resource', 'story', 'event']),
    check('tags').optional().isArray(),
    check('tags.*').isString().trim().isLength({ max: 20 })
  ]),
  communityController.createPost
);

router.post(
  '/posts/:postId/comments',
  authMiddleware.authenticate,
  validate([
    check('content').notEmpty().trim().isLength({ min: 1, max: 2000 })
  ]),
  communityController.addComment
);

router.post(
  '/events',
  authMiddleware.authenticate,
  validate([
    check('title').notEmpty().trim().isLength({ min: 5, max: 100 }),
    check('description').notEmpty().trim().isLength({ min: 10, max: 2000 }),
    check('startDate').isISO8601().toDate(),
    check('endDate').isISO8601().toDate(),
    check('locationType').isIn(['physical', 'virtual', 'hybrid']),
    check('location').if(check('locationType').equals('physical')).notEmpty(),
    check('meetingLink').if(check('locationType').isIn(['virtual', 'hybrid'])).isURL()
  ]),
  communityController.createEvent
);

router.post(
  '/events/:eventId/rsvp',
  authMiddleware.authenticate,
  communityController.rsvpToEvent
);

router.post(
  '/stories',
  authMiddleware.authenticate,
  upload.array('media', 5),
  validate([
    check('title').notEmpty().trim().isLength({ min: 5, max: 100 }),
    check('content').notEmpty().trim().isLength({ min: 10, max: 5000 }),
    check('disabilityType').notEmpty().isLength({ max: 50 }),
    check('isAnonymous').optional().isBoolean()
  ]),
  communityController.createStory
);

//Like routes separated by content type to avoid path-to-regexp issues
router.post(
  '/posts/:postId/likes',
  authMiddleware.authenticate,
  communityController.toggleLike
);

router.post(
  '/events/:eventId/likes',
  authMiddleware.authenticate,
  communityController.toggleLike
);

router.post(
  '/stories/:storyId/likes',
  authMiddleware.authenticate,
  communityController.toggleLike
);

//=================== Moderation Routes ===================
router.patch(
  '/posts/:postId/status',
  authMiddleware.authenticate,
  authMiddleware.authorize(['admin', 'moderator']),
  validate([
    check('status').isIn(['active', 'archived', 'reported']),
    check('moderationNotes').optional().trim().isLength({ max: 500 })
  ]),
  communityController.updatePostStatus
);

module.exports = router;