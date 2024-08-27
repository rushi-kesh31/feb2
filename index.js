const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin.js');
const userRoutes = require('./routes/user.js');

app.use(cors());

app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

mongoose.connect('mongodb+srv://rushi_kesh219:LTKoScWlvofsGz8h@cluster0.5hvsu8b.mongodb.net/femessence', {
  dbName: "femessence"
});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
