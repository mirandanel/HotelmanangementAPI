const express = require('express');
const router = express.Router();
const { validateRoom } = require('../middleware/validator');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

router.route('/')
  .get(getRooms)
  .post(validateRoom, createRoom);

router.route('/:id')
  .get(getRoom)
  .put(validateRoom, updateRoom)
  .delete(deleteRoom);

module.exports = router;
