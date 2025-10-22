const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { validateBooking, validateBookingUpdate } = require('../middleware/validation');

router.route('/')
  .get(getBookings)
  .post(validateBooking, createBooking);

router.route('/:id')
  .get(getBooking)
  .put(validateBookingUpdate, updateBooking)
  .delete(deleteBooking);

module.exports = router;
