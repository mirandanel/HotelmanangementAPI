require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const roomRoutes = require('./routes/rooms');
const guestRoutes = require('./routes/guests');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: '🏨 Hotel Management API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      rooms: '/api/rooms',
      guests: '/api/guests',
      bookings: '/api/bookings'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use(errorHandler);

// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
