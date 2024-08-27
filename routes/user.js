// file: routes.js

const express = require('express');
const { User, Admin, Course } = require('../db');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../middleware/auth');
const { authenticateJwt } = require('../middleware/auth');

const router = express.Router();

//User routes
router.post('/signup', async (req, res) => {
  const user = req.body;
  const existingUser = await User.findOne({ username: user.username });
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User(user);
    await newUser.save();
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, password }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

router.get('/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json(courses);
});

router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
