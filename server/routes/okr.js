const express = require('express');
const router = express.Router();
const OKR = require('../models/OKR');
const verifyToken = require('../middleware/authMiddleware');

// Create OKR
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    const { title, objective, keyResults } = req.body;
    const newOKR = new OKR({
      title,
      objective,
      keyResults,
      owner: req.user.id
    });
    await newOKR.save();
    res.status(201).json(newOKR);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all OKRs of the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const okrs = await OKR.find({ owner: req.user.id });
    res.json(okrs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an OKR
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const okr = await OKR.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!okr) return res.status(404).json({ message: 'OKR not found' });
    res.json(okr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an OKR
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const okr = await OKR.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });
    if (!okr) return res.status(404).json({ message: 'OKR not found' });
    res.json({ message: 'OKR deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;