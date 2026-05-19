const express = require('express');
const router = express.Router();
const Project = require('../models/project'); // Ensures your Project schema model is referenced properly
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/projects
// @desc    Get all portfolio projects (Newest entries display first)
// @route   GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // CRITICAL: Make sure you are sending the raw array directly!
    // Do NOT do res.json({ projects }) or res.json({ success: true, projects })
    res.json(projects); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/projects
// @desc    Add a new project document record to MongoDB
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, techStack, githubLink, liveLink, image } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      techStack,
      githubLink,
      liveLink,
      image
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Remove an explicit project item document by its unique ObjectID reference
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project record not found in database collection.' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project record dropped from database collection successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;