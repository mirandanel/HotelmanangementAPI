const express = require('express');
const router = express.Router();
const {
  getGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestBookings
} = require('../controllers/guestController');
const { validateGuest, validateGuestUpdate } = require('../middleware/validation');

router.route('/')
  .get(getGuests)
  .post(validateGuest, createGuest);

router.route('/:id')
  .get(getGuest)
  .put(validateGuestUpdate, updateGuest)
  .delete(deleteGuest);

router.route('/:id/bookings')
  .get(getGuestBookings);

module.exports = router;
