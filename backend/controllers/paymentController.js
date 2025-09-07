const pool = require('../db');
const crypto = require('crypto');

// Currency for manual payment records
const PAYHERE_CURRENCY = 'LKR';


// ============================
// @desc Get payment status
// @route GET /api/payments/:paymentId/status
// ============================
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const [paymentRows] = await pool.query(`
      SELECT p.*, b.type as booking_type, b.status as booking_status
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ?
    `, [paymentId]);

    if (paymentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = paymentRows[0];

    res.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        statusCode: payment.status_code,
        statusMessage: payment.status_message,
        paymentId: payment.payment_id,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        booking: {
          type: payment.booking_type,
          status: payment.booking_status
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get payments by booking
// @route GET /api/payments/booking/:bookingId
// ============================
const getPaymentsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [paymentRows] = await pool.query(`
      SELECT * FROM payments 
      WHERE booking_id = ? 
      ORDER BY created_at DESC
    `, [bookingId]);

    res.json({
      success: true,
      payments: paymentRows.map(payment => ({
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        statusCode: payment.status_code,
        statusMessage: payment.status_message,
        paymentId: payment.payment_id,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at
      }))
    });

  } catch (error) {
    console.error('❌ Error getting payments by booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Create payment record (for manual payments)
// @route POST /api/payments/create
// ============================
const createPaymentRecord = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    // Validation
    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate order ID
    const orderId = `MAN_${bookingId}_${Date.now()}`;

    // Insert payment record
    const [result] = await pool.query(`
      INSERT INTO payments (
        booking_id, order_id, amount, currency, 
        status, payment_method, transaction_id, notes,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      bookingId, orderId, amount, PAYHERE_CURRENCY,
      'completed', paymentMethod, transactionId || null, notes || null
    ]);

    // Update booking status
    await pool.query(
      'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
      ['confirmed', 'paid', bookingId]
    );

    res.json({
      success: true,
      message: 'Payment record created successfully',
      payment: {
        id: result.insertId,
        orderId,
        amount,
        status: 'completed'
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPaymentStatus,
  getPaymentsByBooking,
  createPaymentRecord
};