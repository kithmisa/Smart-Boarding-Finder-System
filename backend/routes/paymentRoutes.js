const express = require('express');
const router = express.Router();
const {
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord,
  createListingPaymentRecord,
  initiatePayHerePayment,
  initiatePayHereListingPayment,
  handlePayHereNotification,
  getPayHerePaymentStatus
} = require('../controllers/paymentController');

// ============================
// Manual Payment Routes
// ============================

// ✅ GET - Get payment status by payment ID
router.get('/:paymentId/status', getPaymentStatus);

// ✅ GET - Get payment history for a booking
router.get('/booking/:bookingId', getPaymentsByBooking);

// ✅ POST - Create manual payment record
router.post('/create', createPaymentRecord);

// ✅ POST - Create owner listing payment record
router.post('/listing/create', createListingPaymentRecord);

// ============================
// PayHere Payment Gateway Routes
// ============================

// ✅ POST - Initiate PayHere payment for booking
router.post('/payhere/initiate', initiatePayHerePayment);

// ✅ POST - Initiate PayHere payment for listing fee
router.post('/payhere/listing/initiate', initiatePayHereListingPayment);

// ✅ POST - Handle PayHere payment notifications
router.post('/payhere/notify', handlePayHereNotification);

// ✅ GET - Get PayHere payment status by order ID
router.get('/payhere/:orderId/status', getPayHerePaymentStatus);

module.exports = router;