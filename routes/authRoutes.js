const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', upload.single('profilePic'), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = '';
    if (req.file) {
      profilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic
    });

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login?error=google_failed' }),
  async (req, res) => {
    const freshUser = await require('../models/User').findById(req.user._id).select('-password');
    const token = jwt.sign(
      { userId: freshUser._id, email: freshUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const user = encodeURIComponent(JSON.stringify({
      id: freshUser._id,
      name: freshUser.name,
      email: freshUser.email,
      profilePic: freshUser.profilePic
    }));
    res.redirect(`http://localhost:5173/login?token=${token}&user=${user}`);
  }
);

module.exports = router;