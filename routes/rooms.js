const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { validateRoom, validateRoomUpdate } = require('../middleware/validation');

router.route('/')
  .get(getRooms)
  .post(validateRoom, createRoom);

router.route('/:id')
  .get(getRoom)
  .put(validateRoomUpdate, updateRoom)
  .delete(deleteRoom);

module.exports = router;
