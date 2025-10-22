const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public
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
      .sort({ checkIn: -1 });

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
// @access  Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price status');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
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
// @access  Public
exports.createBooking = async (req, res, next) => {
  try {
    const { guestId, roomId, checkIn, checkOut } = req.body;

    // Verify guest exists
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Guest not found'
      });
    }

    // Verify room exists and is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        error: 'Room is not available for selected dates'
      });
    }

    const booking = await Booking.create(req.body);

    // Update room status to occupied
    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Public
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // If status is being changed to checked-out, update room status
    if (req.body.status === 'checked-out' && booking.status !== 'checked-out') {
      await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('guestId', 'name email phone')
      .populate('roomId', 'number type price');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Public
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Update room status back to available
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
