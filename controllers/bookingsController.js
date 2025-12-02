const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getAll = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('guestId').populate('roomId');
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('guestId').populate('roomId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    // basic validation: check room availability (simple approach)
    const { roomId, checkIn, checkOut } = req.body;
    // Optionally: check conflicting bookings - left simple for class requirements
    const booking = await Booking.create(req.body);
    // mark room occupied (business logic example)
    await Room.findByIdAndUpdate(roomId, { status: 'occupied' });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // optionally free room
    await Room.findByIdAndUpdate(booking.roomId, { status: 'available' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
