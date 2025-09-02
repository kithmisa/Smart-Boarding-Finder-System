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
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const visitRequestRoutes = require('./routes/visitRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const websiteRatingRoutes = require('./routes/websiteRatingRoutes');

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
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/favorites', favoritesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/visit-requests', visitRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/website-ratings', websiteRatingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

app.get('/', (req, res) => {
  res.send('✅ Backend server is running');
});