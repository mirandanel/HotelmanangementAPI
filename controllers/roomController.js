const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
exports.getRooms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };

    const rooms = await Room.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ number: 1 });

    const total = await Room.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
