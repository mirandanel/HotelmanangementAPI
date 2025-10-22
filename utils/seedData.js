require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const Booking = require('../models/Booking');

const rooms = [
  { number: '101', type: 'Single', price: 100, status: 'available', capacity: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { number: '102', type: 'Double', price: 150, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { number: '103', type: 'Suite', price: 300, status: 'available', capacity: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { number: '201', type: 'Single', price: 100, status: 'available', capacity: 1, amenities: ['WiFi', 'TV', 'AC'] },
  { number: '202', type: 'Double', price: 150, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'] },
  { number: '203', type: 'Deluxe', price: 250, status: 'available', capacity: 2, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'] },
  { number: '301', type: 'Suite', price: 300, status: 'available', capacity: 3, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi'] },
  { number: '302', type: 'Presidential', price: 500, status: 'available', capacity: 4, amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Butler Service'] }
];

const guests = [
  { name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', nationality: 'USA', idDocument: 'P1234567' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1234567891', nationality: 'UK', idDocument: 'P7654321' },
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '+1234567892', nationality: 'Canada', idDocument: 'P1122334' },
  { name: 'Bob Wilson', email: 'bob.wilson@example.com', phone: '+1234567893', nationality: 'Australia', idDocument: 'P5566778' },
  { name: 'Charlie Brown', email: 'charlie.brown@example.com', phone: '+1234567894', nationality: 'USA', idDocument: 'P9988776' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Room.deleteMany();
    await Guest.deleteMany();
    await Booking.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Insert rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ Created ${createdRooms.length} rooms`);

    // Insert guests
    const createdGuests = await Guest.insertMany(guests);
    console.log(`✅ Created ${createdGuests.length} guests`);

    // Create sample bookings
    const bookings = [
      {
        guestId: createdGuests[0]._id,
        roomId: createdRooms[0]._id,
        checkIn: new Date('2025-11-01'),
        checkOut: new Date('2025-11-05'),
        status: 'confirmed',
        numberOfGuests: 1
      },
      {
        guestId: createdGuests[1]._id,
        roomId: createdRooms[2]._id,
        checkIn: new Date('2025-11-10'),
        checkOut: new Date('2025-11-15'),
        status: 'confirmed',
        numberOfGuests: 2
      }
    ];

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    // Update room status for booked rooms
    await Room.findByIdAndUpdate(createdRooms[0]._id, { status: 'occupied' });
    await Room.findByIdAndUpdate(createdRooms[2]._id, { status: 'occupied' });

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
