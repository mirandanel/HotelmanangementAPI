// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const roomsRoutes = require('./routes/rooms');
const guestsRoutes = require('./routes/guests');
const bookingsRoutes = require('./routes/bookings');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// routes
app.use('/api/rooms', roomsRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/bookings', bookingsRoutes);

// healthcheck
app.get('/', (req, res) => res.json({ status: 'ok' }));

// global error handler
app.use(errorHandler);

// connect db + start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
