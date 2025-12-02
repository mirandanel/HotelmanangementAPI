const Guest = require('../models/Guest');

exports.getAll = async (req, res, next) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
