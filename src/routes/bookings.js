const express = require('express');
const router = express.Router();
const { validateBooking } = require('../middleware/validator');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

router.route('/')
  .get(getBookings)
  .post(validateBooking, createBooking);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
