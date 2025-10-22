const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
  },
  address: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  idDocument: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);
