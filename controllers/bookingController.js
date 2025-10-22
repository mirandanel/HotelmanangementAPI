const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// @desc    Get all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.guestId) filter.guestId = req.query.guestId;
    if (req.query.roomId) filter.roomId = req.query.roomId;

    const bookings = await Booking.find(filter)
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price status');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { guestId, roomId, checkIn, checkOut } = req.body;

    // Verify guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Verify room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check room availability
    if (room.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Room is currently ${room.status}`
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the selected dates'
      });
    }

    const booking = await Booking.create(req.body);

    // Update room status
    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update room status if booking is checked out or cancelled
    if (req.body.status === 'checked-out' || req.body.status === 'cancelled') {
      await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make room available again
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
