const express = require('express');
const router = express.Router();
const {
  // Removed PayHere-specific endpoints. Keeping manual record/status endpoints.
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord,
  createListingPaymentRecord
} = require('../controllers/paymentController');

// Removed /initiate and /notify endpoints related to PayHere

// ✅ GET - Get payment status by payment ID
router.get('/:paymentId/status', getPaymentStatus);

// ✅ GET - Get payment history for a booking
router.get('/booking/:bookingId', getPaymentsByBooking);

// ✅ POST - Create manual payment record
router.post('/create', createPaymentRecord);

// ✅ POST - Create owner listing payment record
router.post('/listing/create', createListingPaymentRecord);

module.exports = router;