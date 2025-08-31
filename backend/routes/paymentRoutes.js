const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  handlePaymentNotification,
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord
} = require('../controllers/paymentController');

// ✅ POST - Initiate PayHere payment
router.post('/initiate', initiatePayment);

// ✅ POST - PayHere notification webhook (must be accessible without authentication)
router.post('/notify', handlePaymentNotification);

// ✅ GET - Get payment status by payment ID
router.get('/:paymentId/status', getPaymentStatus);

// ✅ GET - Get payment history for a booking
router.get('/booking/:bookingId', getPaymentsByBooking);

// ✅ POST - Create manual payment record
router.post('/create', createPaymentRecord);

module.exports = router;