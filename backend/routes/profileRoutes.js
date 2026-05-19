const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile'); // Make sure you have Profile.js in your models folder!
const authMiddleware = require('../middleware/authMiddleware');

// GET entire profile info
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create empty profile if none exists yet
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile data (Bio, Skills, Edu, Exp)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




// GET /api/contact - Retrieve all contact messages for the admin inbox
router.get('/contact', authMiddleware, async (req, res) => {
  try {
    const Message = require('../models/Message');
    const messages = await Message.find().sort({ createdAt: -1 }); // Get newest messages first
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;