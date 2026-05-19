const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/visits
// @desc    Record a new site visit
router.post('/', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const { userAgent, platform, language } = req.body;
    
    const newVisit = new Visit({
      userAgent,
      platform,
      language,
      ip
    });

    const savedVisit = await newVisit.save();
    res.status(201).json(savedVisit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/visits
// @desc    Get all recorded visits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const visits = await Visit.find().sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
