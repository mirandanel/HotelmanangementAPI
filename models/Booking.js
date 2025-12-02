const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, enum: ['booked','checked-in','checked-out','cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
