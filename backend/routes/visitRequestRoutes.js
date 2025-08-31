const express = require('express');
const router = express.Router();
const db = require('../db');
const emailService = require('../services/emailService');

// Test route to verify registration
router.get('/test', (req, res) => {
  res.json({ message: 'Visit request routes are working!' });
});

// ============================
// @desc Get visit requests for owner
// @route GET /api/visit-requests/owner/:ownerId
// ============================
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const [rows] = await db.query(`
      SELECT 
        vr.*, 
        h.title as boarding_title,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      JOIN users u ON vr.user_id = u.id
      WHERE h.owner_id = ?
      ORDER BY vr.created_at DESC
    `, [ownerId]);

    res.json({
      success: true,
      visitRequests: rows
    });

  } catch (error) {
    console.error('Error fetching owner visit requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visit requests'
    });
  }
});

// ============================
// @desc Get visit requests for user
// @route GET /api/visit-requests/user/:userId
// ============================
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await db.query(`
      SELECT 
        vr.*, 
        h.title as boarding_title,
        h.address,
        o.contact as owner_phone,
        o.name as owner_name,
        o.email as owner_email
      FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      JOIN owner o ON h.owner_id = o.id
      WHERE vr.user_id = ?
      ORDER BY vr.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      visitRequests: rows
    });

  } catch (error) {
    console.error('Error fetching user visit requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visit requests'
    });
  }
});

// ============================
// @desc Create new visit request
// @route POST /api/visit-requests
// ============================
router.post('/', async (req, res) => {
  try {
    const { boardingId, userId, requestedDate, message } = req.body;

    // Validate required fields
    if (!boardingId || !userId || !requestedDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: boardingId, userId, requestedDate'
      });
    }

    // Insert visit request
    const [result] = await db.query(`
      INSERT INTO visit_requests 
      (boarding_id, user_id, requested_date, message, status) 
      VALUES (?, ?, ?, ?, 'pending')
    `, [boardingId, userId, requestedDate, message || '']);

    // Get owner info, property details, and user details for notification
    const [ownerInfo] = await db.query(`
      SELECT 
        o.id as owner_id, 
        o.name as owner_name, 
        o.email as owner_email, 
        h.title as property_title
      FROM houses h
      JOIN owner o ON h.owner_id = o.id
      WHERE h.id = ?
    `, [boardingId]);

    const [userInfo] = await db.query(`
      SELECT first_name, last_name, email FROM users WHERE id = ?
    `, [userId]);

    if (ownerInfo.length > 0 && userInfo.length > 0) {
      const owner = ownerInfo[0];
      const user = userInfo[0];
      const studentName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Student';

      // Create notification for owner in database
      await db.query(`
        INSERT INTO notifications 
        (user_id, owner_id, boarding_id, visit_request_id, type, title, message)
        VALUES (?, ?, ?, ?, 'visit_request', 'New Visit Request', 'Someone wants to visit your property')
      `, [userId, owner.owner_id, boardingId, result.insertId]);

      // Send email notification to owner
      try {
        console.log('🔔 Sending email notification to owner...');
        await emailService.sendVisitRequestNotification(
          owner.owner_email,
          owner.owner_name,
          owner.property_title,
          studentName,
          requestedDate,
          null, // requestedTime (not captured in current form)
          message || 'No additional message provided'
        );
        console.log('✅ Email notification sent successfully to owner');
      } catch (emailError) {
        console.error('❌ Failed to send email notification to owner:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    res.status(201).json({
      success: true,
      message: 'Visit request submitted successfully',
      visitRequestId: result.insertId
    });

  } catch (error) {
    console.error('Error creating visit request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create visit request'
    });
  }
});

// ============================
// @desc Confirm visit request
// @route PUT /api/visit-requests/:requestId/confirm
// ============================
router.put('/:requestId/confirm', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { confirmedDate, confirmedTime, ownerResponse } = req.body;

    // Validate required fields
    if (!confirmedDate || !confirmedTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: confirmedDate, confirmedTime'
      });
    }

    // Update visit request
    const [result] = await db.query(`
      UPDATE visit_requests 
      SET status = 'confirmed', 
          confirmed_date = ?, 
          confirmed_time = ?, 
          owner_response = ?,
          updated_at = NOW()
      WHERE id = ?
    `, [confirmedDate, confirmedTime, ownerResponse || '', requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Visit request not found'
      });
    }

    // Get visit request details for notification
    const [visitRequest] = await db.query(`
      SELECT vr.*, h.owner_id FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      WHERE vr.id = ?
    `, [requestId]);

    if (visitRequest.length > 0) {
      // Create notification for user
      await db.query(`
        INSERT INTO notifications 
        (user_id, owner_id, boarding_id, visit_request_id, type, title, message)
        VALUES (?, ?, ?, ?, 'visit_confirmed', 'Visit Request Confirmed', 'Your visit request has been confirmed')
      `, [visitRequest[0].user_id, visitRequest[0].owner_id, visitRequest[0].boarding_id, requestId]);

      // Get user email for notification
      const [userInfo] = await db.query(`
        SELECT u.email, u.first_name, h.title as property_title
        FROM users u
        JOIN visit_requests vr ON u.id = vr.user_id
        JOIN houses h ON vr.boarding_id = h.id
        WHERE vr.id = ?
      `, [requestId]);

      // Send email notification
      if (userInfo.length > 0) {
        const user = userInfo[0];
        try {
          await emailService.sendVisitConfirmationEmail({
            to: user.email,
            userName: user.first_name,
            propertyTitle: user.property_title,
            confirmedDate: confirmedDate,
            confirmedTime: confirmedTime,
            ownerMessage: ownerResponse
          });
          console.log('✅ Confirmation email sent to:', user.email);
        } catch (emailError) {
          console.error('❌ Failed to send confirmation email:', emailError);
        }
      }
    }

    res.json({
      success: true,
      message: 'Visit request confirmed successfully and email sent'
    });

  } catch (error) {
    console.error('Error confirming visit request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm visit request'
    });
  }
});

// ============================
// @desc Reject visit request
// @route PUT /api/visit-requests/:requestId/reject
// ============================
router.put('/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { ownerResponse } = req.body;

    // Update visit request
    const [result] = await db.query(`
      UPDATE visit_requests 
      SET status = 'rejected', 
          owner_response = ?,
          updated_at = NOW()
      WHERE id = ?
    `, [ownerResponse || 'Request rejected', requestId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Visit request not found'
      });
      
    }

    // Get visit request details for notification
    const [visitRequest] = await db.query(`
      SELECT vr.*, h.owner_id FROM visit_requests vr
      JOIN houses h ON vr.boarding_id = h.id
      WHERE vr.id = ?
    `, [requestId]);

    if (visitRequest.length > 0) {
      // Create notification for user
      await db.query(`
        INSERT INTO notifications 
        (user_id, owner_id, boarding_id, visit_request_id, type, title, message)
        VALUES (?, ?, ?, ?, 'visit_rejected', 'Visit Request Rejected', 'Your visit request has been rejected')
      `, [visitRequest[0].user_id, visitRequest[0].owner_id, visitRequest[0].boarding_id, requestId]);

      // Get user email for notification
      const [userInfo] = await db.query(`
        SELECT u.email, u.first_name, h.title as property_title
        FROM users u
        JOIN visit_requests vr ON u.id = vr.user_id
        JOIN houses h ON vr.boarding_id = h.id
        WHERE vr.id = ?
      `, [requestId]);

      // Send email notification
      if (userInfo.length > 0) {
        const user = userInfo[0];
        try {
          await emailService.sendVisitRejectionEmail({
            to: user.email,
            userName: user.first_name,
            propertyTitle: user.property_title,
            rejectionReason: ownerResponse,
            suggestedDate: req.body.suggestedDate,
            suggestedTime: req.body.suggestedTime
          });
          console.log('✅ Rejection email sent to:', user.email);
        } catch (emailError) {
          console.error('❌ Failed to send rejection email:', emailError);
        }
      }
    }

    res.json({
      success: true,
      message: 'Visit request rejected successfully and email sent'
    });

  } catch (error) {
    console.error('Error rejecting visit request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject visit request'
    });
  }
});

module.exports = router;