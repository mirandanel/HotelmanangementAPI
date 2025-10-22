const Guest = require('../models/Guest');
const Booking = require('../models/Booking');

// @desc    Get all guests
// @route   GET /api/guests
exports.getGuests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const guests = await Guest.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Guest.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: guests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: guests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guest
// @route   GET /api/guests/:id
exports.getGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.status(200).json({
      success: true,
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guest bookings
// @route   GET /api/guests/:id/bookings
exports.getGuestBookings = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    const bookings = await Booking.find({ guestId: req.params.id })
      .populate('roomId', 'number type price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new guest
// @route   POST /api/guests
exports.createGuest = async (req, res, next) => {
  try {
    const guest = await Guest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guest
// @route   PUT /api/guests/:id
exports.updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest updated successfully',
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete guest
// @route   DELETE /api/guests/:id
exports.deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
