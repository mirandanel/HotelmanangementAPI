const dotenv = require('dotenv');
const connectDB = require('../src/config/database');
const app = require('../src/app');

// Load environment variables
dotenv.config({ silent: true });

// Connect to MongoDB (will reuse connection)
connectDB();

// Export for Vercel serverless
module.exports = app;
