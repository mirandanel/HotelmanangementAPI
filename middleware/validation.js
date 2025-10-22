const Joi = require('joi');

// Room validation schemas
const roomSchema = Joi.object({
  number: Joi.string().required().trim(),
  type: Joi.string().valid('Single', 'Double', 'Suite', 'Deluxe', 'Presidential').required(),
  price: Joi.number().min(0).required(),
  status: Joi.string().valid('available', 'occupied', 'maintenance'),
  amenities: Joi.array().items(Joi.string()),
  capacity: Joi.number().min(1)
});

const roomUpdateSchema = Joi.object({
  number: Joi.string().trim(),
  type: Joi.string().valid('Single', 'Double', 'Suite', 'Deluxe', 'Presidential'),
  price: Joi.number().min(0),
  status: Joi.string().valid('available', 'occupied', 'maintenance'),
  amenities: Joi.array().items(Joi.string()),
  capacity: Joi.number().min(1)
}).min(1);

// Guest validation schemas
const guestSchema = Joi.object({
  name: Joi.string().min(2).required().trim(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().required().trim(),
  address: Joi.string().trim(),
  nationality: Joi.string().trim(),
  idDocument: Joi.string().trim()
});

const guestUpdateSchema = Joi.object({
  name: Joi.string().min(2).trim(),
  email: Joi.string().email().trim(),
  phone: Joi.string().trim(),
  address: Joi.string().trim(),
  nationality: Joi.string().trim(),
  idDocument: Joi.string().trim()
}).min(1);

// Booking validation schemas
const bookingSchema = Joi.object({
  guestId: Joi.string().required(),
  roomId: Joi.string().required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  status: Joi.string().valid('confirmed', 'checked-in', 'checked-out', 'cancelled'),
  numberOfGuests: Joi.number().min(1),
  specialRequests: Joi.string().trim()
});

const bookingUpdateSchema = Joi.object({
  guestId: Joi.string(),
  roomId: Joi.string(),
  checkIn: Joi.date().iso(),
  checkOut: Joi.date().iso(),
  status: Joi.string().valid('confirmed', 'checked-in', 'checked-out', 'cancelled'),
  numberOfGuests: Joi.number().min(1),
  specialRequests: Joi.string().trim()
}).min(1);

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  validateRoom: validate(roomSchema),
  validateRoomUpdate: validate(roomUpdateSchema),
  validateGuest: validate(guestSchema),
  validateGuestUpdate: validate(guestUpdateSchema),
  validateBooking: validate(bookingSchema),
  validateBookingUpdate: validate(bookingUpdateSchema)
};
