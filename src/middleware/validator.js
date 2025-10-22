const Joi = require('joi');

// Room validation schema
const roomSchema = Joi.object({
  number: Joi.string().required(),
  type: Joi.string().valid('single', 'double', 'suite', 'deluxe').required(),
  price: Joi.number().min(0).required(),
  status: Joi.string().valid('available', 'occupied', 'maintenance'),
  capacity: Joi.number().min(1),
  amenities: Joi.array().items(Joi.string())
});

// Guest validation schema
const guestSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
  address: Joi.string(),
  idNumber: Joi.string()
});

// Booking validation schema
const bookingSchema = Joi.object({
  guestId: Joi.string().length(24).required(),
  roomId: Joi.string().length(24).required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).required(),
  status: Joi.string().valid('confirmed', 'checked-in', 'checked-out', 'cancelled'),
  specialRequests: Joi.string()
});

// Middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    next();
  };
};

module.exports = {
  validateRoom: validate(roomSchema),
  validateGuest: validate(guestSchema),
  validateBooking: validate(bookingSchema)
};
