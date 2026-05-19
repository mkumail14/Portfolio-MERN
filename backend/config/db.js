const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect using the URI stored in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the application with failure if it can't connect
  }
};

module.exports = connectDB;