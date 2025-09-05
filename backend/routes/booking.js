const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection

// Create a stay booking
router.post('/stay', (req, res) => {
  const { userId, houseId, checkIn, checkOut, totalPrice, advancePayment } = req.body;

  if (!userId || !houseId || !checkIn || !checkOut || !totalPrice || !advancePayment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO stay_bookings 
    (user_id, house_id, check_in, check_out, total_price, advance_payment)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, houseId, checkIn, checkOut, totalPrice, advancePayment], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Stay booking request sent', bookingId: result.insertId });
  });
});

module.exports = router;

