const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Multi-part Form Destination Storage Config for updating Resume File
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pushes the incoming pdf directly into your React public directory asset location
    cb(null, path.join(__dirname, '../frontend/public'));
  },
  filename: (req, file, cb) => {
    cb(null, 'Kumail_Asghar_Resume.pdf'); // Standardized runtime filename mapping
  }
});
const upload = multer({ storage });

// API Route Bindings
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

// Certificate PDF Upload Config
const fs = require('fs');
const certsDir = path.join(__dirname, '../frontend/public/certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, certsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadCert = multer({ storage: certStorage });

app.post('/api/upload-cert', authMiddleware, uploadCert.single('certificate'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  // Return the public URL for the file
  res.json({ url: '/certs/' + req.file.filename });
});

// POST Route for structural Resume PDF Replacement
app.post('/api/upload-resume', authMiddleware, upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  res.json({ message: 'Resume PDF uploaded and replaced successfully!' });
});

// POST Route to capture contact inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, text } = req.body;
    if (!name || !email || !text) return res.status(400).json({ message: "All fields are required." });
    
    const Message = require('./models/Message');
    const newMessage = await Message.create({ name, email, text });
    res.status(201).json({ message: "Message securely saved to database!", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// Add this inside backend/server.js right below your app.post('/api/contact') endpoint:
app.get('/api/contact', authMiddleware, async (req, res) => {
  try {
    const Message = require('./models/Message');
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.listen(5000, () => console.log('Backend Engine Running on Port 5000'));