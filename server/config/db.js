const mongoose = require('mongoose');

/**
 * connectDB — establishes the Mongoose/MongoDB connection.
 * Called once at server startup. Exits the process on failure
 * so a broken DB config is caught immediately.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // non-zero exit signals a startup failure
  }
};

module.exports = connectDB;
