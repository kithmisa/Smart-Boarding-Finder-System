const express = require('express');
const router = express.Router();
const {
  createVisitBooking,
  createStayBooking,
  getBookingById,
  updateBookingStatus,
  getBookingsByHouse,
  getAllBookings
} = require('../controllers/bookingController');

// ✅ POST - Create visit booking
router.post('/visit', createVisitBooking);

// ✅ POST - Create stay booking  
router.post('/stay', createStayBooking);

// ✅ GET - Get all bookings with filters
router.get('/', getAllBookings);

// ✅ GET - Get bookings for a specific house
router.get('/house/:houseId', getBookingsByHouse);

// ✅ GET - Get booking by ID
router.get('/:id', getBookingById);

// ✅ PUT - Update booking status
router.put('/:id/status', updateBookingStatus);

module.exports = router;