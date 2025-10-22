const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
      required: [true, 'Guest ID is required']
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required']
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function(value) {
          return value > this.checkIn;
        },
        message: 'Check-out date must be after check-in date'
      }
    },
    status: {
      type: String,
      enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'confirmed',
      lowercase: true
    },
    totalAmount: {
      type: Number,
      min: 0
    },
    specialRequests: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
bookingSchema.index({ guestId: 1, status: 1 });
bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });

// Calculate total amount before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('checkIn') || this.isModified('checkOut')) {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.roomId);
    
    if (room) {
      const days = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
      this.totalAmount = days * room.price;
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
