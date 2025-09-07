const express = require('express');
const router = express.Router();
const {
  // Removed PayHere-specific endpoints. Keeping manual record/status endpoints.
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord
} = require('../controllers/paymentController');

// Removed /initiate and /notify endpoints related to PayHere

// ✅ GET - Get payment status by payment ID
router.get('/:paymentId/status', getPaymentStatus);

// ✅ GET - Get payment history for a booking
router.get('/booking/:bookingId', getPaymentsByBooking);

// ✅ POST - Create manual payment record
router.post('/create', createPaymentRecord);

module.exports = router;