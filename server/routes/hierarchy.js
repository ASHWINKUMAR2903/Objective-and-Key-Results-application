const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Department = require('../models/Department');
const Team = require('../models/Team');
const User = require('../models/User');

// Create an Organization
router.post('/organizations', async (req, res) => {
  try {
    const org = new Organization(req.body);
    await org.save();
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add Department to Organization
router.post('/organizations/:orgId/departments', async (req, res) => {
  try {
    const dept = new Department({
      name: req.body.name,
      organization: req.params.orgId
    });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add Team to Department
router.post('/departments/:deptId/teams', async (req, res) => {
  try {
    const team = new Team({
      name: req.body.name,
      department: req.params.deptId
    });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Assign User to Team
router.post('/teams/:teamId/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { team: req.params.teamId },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get full hierarchy
router.get('/', async (req, res) => {
  try {
    const orgs = await Organization.find()
      .populate({
        path: 'departments',
        populate: { path: 'teams' }
      });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;