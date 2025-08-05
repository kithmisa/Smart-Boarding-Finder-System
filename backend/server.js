// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const ownerRoutes = require('./routes/ownerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const houseRoutes = require('./routes/houseRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/owner', ownerRoutes); // e.g. /api/owner/register
app.use('/api/contact', contactRoutes); 
app.use('/api/houses', houseRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

app.get('/', (req, res) => {
  res.send('✅ Backend server is running');
});