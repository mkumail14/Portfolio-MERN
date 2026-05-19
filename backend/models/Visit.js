const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  userAgent: { type: String, default: 'Unknown' },
  platform: { type: String, default: 'Unknown' },
  language: { type: String, default: 'Unknown' },
  ip: { type: String, default: 'Unknown' },
}, { timestamps: true });

module.exports = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);
