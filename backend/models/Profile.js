const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: {
    name: { type: String, default: "Mohammad Kumail Asghar" },
    title: { type: String, default: "Junior Computer Science Student" },
    summary: { type: String, default: "" },
    email: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    location: { type: String, default: "" }
  },
  skills: {
    languages: [String],
    frameworks: [String],
    databases: [String],
    tools: [String]
  },
  education: [{
    institution: String,
    degree: String,
    timeline: String,
    details: String
  }],
  experience: [{
    company: String,
    role: String,
    timeline: String,
    description: String
  }],
  status: { type: String, default: "Available for New Opportunities" },
  heroHeading: { type: String, default: "Crafting Digital Experiences" },
  contactText: { type: String, default: "Have an opening, an interesting project framework suggestion, or want to discuss full-stack or security challenges? Send a message directly into my database cluster console." },
  metrics: { 
    type: [{ title: String, text: String }], 
    default: [
      { title: "3+", text: "Years Coding" }, 
      { title: "15+", text: "Projects Built" }, 
      { title: "3.08", text: "Major CGPA" }
    ] 
  },
  resumeUrl: { type: String, default: "" },
  profilePicUrl: { type: String, default: "" },
  certifications: { 
    type: [{ title: String, issuer: String, pdfUrl: String }], 
    default: [
      { title: "AWS Academy Graduate: Cloud Foundations", issuer: "AWS Academy", pdfUrl: "" }, 
      { title: "Web & Mobile App Development", issuer: "Saylani Mass IT Training Program (SMIT)", pdfUrl: "" }, 
      { title: "Career Essentials in Software Development", issuer: "Microsoft & LinkedIn", pdfUrl: "" }
    ] 
  }
}, { timestamps: true });

module.exports = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);