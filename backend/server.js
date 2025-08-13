// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const ownerRoutes = require('./routes/ownerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const houseRoutes = require('./routes/houseRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/owner', ownerRoutes); // e.g. /api/owner/register
app.use('/api/contact', contactRoutes); 
app.use('/api/houses', houseRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

app.get('/', (req, res) => {
  res.send('✅ Backend server is running');
});