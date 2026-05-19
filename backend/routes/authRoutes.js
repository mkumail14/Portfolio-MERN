const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    return res.status(500).json({ message: 'Server configuration error: ADMIN_PASSWORD not set in .env' });
  }

  if (password === adminPass) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret_if_not_set', { expiresIn: '12h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid passcode' });
});

module.exports = router;
