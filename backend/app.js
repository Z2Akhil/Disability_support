// --- Error listeners ---
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// --- Load environment variables ---
require('dotenv').config();

// --- Core dependencies ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

// --- Logger ---
const logger = console;

// --- Initialize Express app and HTTP server ---
const app = express();
const httpServer = createServer(app);

// --- Initialize Socket.io ---
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// --- MongoDB connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('✅ Connected to MongoDB'))
  .catch(err => logger.error('❌ MongoDB connection error:', err));

// --- Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ CORS fix for cross-origin image loading
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(helmet());
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// --- Rate limiter ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// --- Static file serving with CORS headers for images ---
app.use('/api/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // <== THIS FIXES IT
  next();
}, express.static(path.join(__dirname, 'uploads')));


// --- Socket.io events ---
io.on('connection', (socket) => {
  logger.info(`🧩 New socket connected: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    logger.info(`📦 Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info(`🚪 Socket disconnected: ${socket.id}`);
  });
});

app.set('io', io);

// --- Routes ---
const routes = [
  ['auth', require('./routes/auth.routes')],
  ['users', require('./routes/user.routes')],
  ['services', require('./routes/service.routes')],
  ['healthcare', require('./routes/healthcare.routes')],
  ['education', require('./routes/education.routes')],
  ['community', require('./routes/community.routes')],
  ['government', require('./routes/government.routes')],
  ['caregivers', require('./routes/caregiver.routes')],
  ['legal', require('./routes/legal.routes')],
  ['emergency', require('./routes/emergency.routes')],
  ['contact', require('./routes/contact.routes')],
];

routes.forEach(([name, route]) => {
  app.use(`/api/${name}`, route);
});

// --- Error handler ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- API status ---
app.get('/api/status', (req, res) => {
  const availableRoutes = [
    '/api/auth',
    '/api/users',
    '/api/services',
    '/api/healthcare',
    '/api/education',
    '/api/community',
    '/api/government',
    '/api/caregivers',
    '/api/legal',
    '/api/emergency',
    '/api/contact',
  ];

  res.json({
    success: true,
    message: 'API is up and running',
    routes: availableRoutes
  });
});

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
