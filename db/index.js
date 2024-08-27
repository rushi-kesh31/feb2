const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30
  },
  password: {
      type: String,
      required: true
  },
  firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
  },
  lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
  },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { collection: 'admins' });

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imgageLink: [String],
  published: Boolean
}, { collection: 'courses' });  

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imgageLink: [String],
  published: Boolean,
  productd: String,
  rating: Number
}, { collection: 'products' });

const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
const Product = mongoose.model('Product', productSchema);


module.exports = { Admin, Course, Product };
