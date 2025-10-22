const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../src/models/Room');
const Guest = require('../src/models/Guest');
const Booking = require('../src/models/Booking');

dotenv.config();

const rooms = [
  { number: '101', type: 'single', price: 100, status: 'available', capacity: 1, amenities: ['WiFi', 'TV'] },
  { number: '102', type: 'double', price: 150, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'Mini Bar'] },
  { number: '103', type: 'suite', price: 300, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi'] },
  { number: '201', type: 'deluxe', price: 500, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'] },
  { number: '202', type: 'double', price: 150, status: 'occupied', capacity: 2, amenities: ['WiFi', 'TV'] },
];

const guests = [
  { name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St', idNumber: 'ID123456' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1234567891', address: '456 Oak Ave', idNumber: 'ID789012' },
  { name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '+1234567892', address: '789 Pine Rd', idNumber: 'ID345678' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Room.deleteMany();
    await Guest.deleteMany();
    await Booking.deleteMany();
    console.log('Data cleared');

    // Insert rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log(`${createdRooms.length} rooms created`);

    // Insert guests
    const createdGuests = await Guest.insertMany(guests);
    console.log(`${createdGuests.length} guests created`);

    // Insert bookings
    const bookings = [
      {
        guestId: createdGuests[0]._id,
        roomId: createdRooms[4]._id,
        checkIn: new Date('2025-10-20'),
        checkOut: new Date('2025-10-25'),
        status: 'checked-in'
      },
      {
        guestId: createdGuests[1]._id,
        roomId: createdRooms[2]._id,
        checkIn: new Date('2025-10-22'),
        checkOut: new Date('2025-10-27'),
        status: 'confirmed'
      }
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} bookings created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
