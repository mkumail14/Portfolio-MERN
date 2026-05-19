const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// 1. Authenticate the Cloudinary SDK using your .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Cloudinary Storage Engine for Resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_assets/resumes',
    allowed_formats: ['pdf', 'jpg', 'png', 'jpeg'],
    resource_type: 'auto',
    public_id: (req, file) => `Resume_${Date.now()}` // Dynamic to avoid caching issues
  }
});
const uploadResume = multer({ storage: resumeStorage });

// 3. Configure Cloudinary Storage Engine for Certificates
const certStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_assets/certificates',
    allowed_formats: ['pdf', 'jpg', 'png', 'jpeg'],
    resource_type: 'auto',
    public_id: (req, file) => `Cert_${Date.now()}`
  }
});
const uploadCert = multer({ storage: certStorage });

// API Route Bindings
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

// POST Route for Certificate Upload
app.post('/api/upload-cert', authMiddleware, uploadCert.single('certificate'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  // Return the Cloudinary secure URL for the file
  res.json({ url: req.file.path });
});

// POST Route for Resume Upload
app.post('/api/upload-resume', authMiddleware, uploadResume.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  res.json({ message: 'Resume uploaded successfully!', url: req.file.path });
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



// Replace your old app.listen block at the bottom with this:
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running locally on port ${PORT}`));
}

module.exports = app; // CRITICAL: This allows Vercel to treat Express as a serverless function handler