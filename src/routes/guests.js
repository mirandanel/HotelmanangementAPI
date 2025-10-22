const express = require('express');
const router = express.Router();
const { validateGuest } = require('../middleware/validator');
const {
  getGuests,
  getGuest,
  getGuestBookings,
  createGuest,
  updateGuest,
  deleteGuest
} = require('../controllers/guestController');

router.route('/')
  .get(getGuests)
  .post(validateGuest, createGuest);

router.route('/:id')
  .get(getGuest)
  .put(validateGuest, updateGuest)
  .delete(deleteGuest);

router.route('/:id/bookings')
  .get(getGuestBookings);

module.exports = router;
