const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hotel Management API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      rooms: '/api/rooms',
      guests: '/api/guests',
      bookings: '/api/bookings'
    },
    documentation: 'See README.md for full API documentation'
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API endpoint active',
    availableRoutes: [
      'GET /api/rooms',
      'POST /api/rooms',
      'GET /api/rooms/:id',
      'PUT /api/rooms/:id',
      'DELETE /api/rooms/:id',
      'GET /api/guests',
      'POST /api/guests',
      'GET /api/guests/:id',
      'PUT /api/guests/:id',
      'DELETE /api/guests/:id',
      'GET /api/guests/:id/bookings',
      'GET /api/bookings',
      'POST /api/bookings',
      'GET /api/bookings/:id',
      'PUT /api/bookings/:id',
      'DELETE /api/bookings/:id'
    ]
  });
});

// API Routes
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/bookings', require('./routes/bookings'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
