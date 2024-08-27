const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
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
