const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected: Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'email _id');
    res.json(users);
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;