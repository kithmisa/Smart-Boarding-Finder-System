const express = require('express');
const router = express.Router();
const {
  createVisitBooking,
  createStayBooking,
  getBookingById,
  updateBookingStatus,
  getBookingsByHouse,
  getAllBookings,
  getStayBookingsForOwner,
  getStayBookingsForUser,
  confirmStayBooking,
  rejectStayBooking,
  updatePaymentStatus
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

// ✅ GET - Get stay bookings for owner
router.get('/stay/owner/:ownerId', getStayBookingsForOwner);

// ✅ GET - Get stay bookings for user
router.get('/stay/user/:userId', getStayBookingsForUser);

// ✅ PUT - Confirm stay booking
router.put('/stay/:id/confirm', confirmStayBooking);

// ✅ PUT - Reject stay booking
router.put('/stay/:id/reject', rejectStayBooking);

// ✅ PUT - Update payment status
router.put('/stay/:id/payment', updatePaymentStatus);

module.exports = router;