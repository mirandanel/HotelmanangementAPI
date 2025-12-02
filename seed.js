// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Guest = require('./models/Guest');
const Booking = require('./models/Booking');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Seed rooms, guests, bookings (same as your current script)
    // ...

    console.log('Seeding complete!');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Seeding Error:', err);
    await mongoose.connection.close();
  }
}

seed();
