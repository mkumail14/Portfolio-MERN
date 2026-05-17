const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Basic sanity check route
app.get('/', (req, res) => {
  res.send('Portfolio API is running smoothly.');
});

// Start listening for connections
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});