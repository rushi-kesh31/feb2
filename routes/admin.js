const express = require('express');
const app = express();
const zod=require("zod");
const {Admin, Product } = require('../db');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../middleware/auth');
const cors = require('cors');
app.use(cors());
const { authenticateJwt } = require('../middleware/auth');

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
firstName: zod.string(),
lastName: zod.string(),
password: zod.string()
})

// Admin routes

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body)
  if (!success) {
      return res.status(411).json({
          message: "Email already taken / Incorrect inputs"
      })
  }
else{
  const admin= req.body
  const existingUser = await Admin.findOne({
      username: req.body.username
  })

  if (existingUser) {
      return res.status(411).json({
          message: "Email already taken"
      })
  }
else{
  const newAdmin = new Admin(admin);
    await newAdmin.save();
    const token = jwt.sign(admin, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
}
}
})






router.get('/me', authenticateJwt, (req, res) => {
  res.json(req.user);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });

  if (admin) {
    const token = jwt.sign({ username, password }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token, username });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

router.post('/courses', authenticateJwt, async (req, res) => {
  const newCourse = new Product(req.body);
  await newCourse.save();
  res.json({ message: 'Course created successfully', courseId: newCourse._id });
});

router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Product.findById(req.params.courseId);
  if (course) {
    const user = await Admin.findOne({ username: req.user.username });
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

router.get('/courses', async (req, res) => {
  const courses = await Product.find({});
  res.json(courses);
});


router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (admin) {
    res.json({ purchasedCourses: admin.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
