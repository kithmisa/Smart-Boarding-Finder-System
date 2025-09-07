const pool = require('../db');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
require('dotenv').config();

// Send booking notification email to owner
const sendBookingNotificationEmail = async (ownerEmail, ownerName, bookingData) => {
  try {
    console.log('📧 Attempting to send email notification...');
    console.log('Email config check:', {
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
      ownerEmail,
      ownerName
    });

    const subject = `New Booking Request - ${bookingData.houseTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Booking Request</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Smart Boarding Finder System</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${ownerName},</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            You have received a new booking request for your property. Please review the details below:
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Property Details</h3>
            <p style="margin: 8px 0;"><strong>Property:</strong> ${bookingData.houseTitle}</p>
            <p style="margin: 8px 0;"><strong>Address:</strong> ${bookingData.houseAddress}</p>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Guest Information</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${bookingData.userName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${bookingData.userEmail}</p>
            <p style="margin: 8px 0;"><strong>Contact:</strong> ${bookingData.userContact}</p>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Booking Details</h3>
            <p style="margin: 8px 0;"><strong>Check-in Date:</strong> ${new Date(bookingData.checkIn).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Check-out Date:</strong> ${new Date(bookingData.checkOut).toLocaleDateString()}</p>
            ${bookingData.checkInTime ? `<p style="margin: 8px 0;"><strong>Preferred Check-in Time:</strong> ${bookingData.checkInTime}</p>` : ''}
            ${bookingData.checkOutTime ? `<p style="margin: 8px 0;"><strong>Preferred Check-out Time:</strong> ${bookingData.checkOutTime}</p>` : ''}
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Payment Information</h3>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> Rs. ${bookingData.totalAmount}</p>
            <p style="margin: 8px 0;"><strong>Advance Payment:</strong> Rs. ${bookingData.advancePayment}</p>
            <p style="margin: 8px 0;"><strong>Service Charge:</strong> Rs. ${bookingData.serviceCharge}</p>
            <p style="margin: 8px 0; font-size: 18px; color: #f97316;"><strong>Total Payment:</strong> Rs. ${bookingData.totalPayment}</p>
          </div>
          
          ${bookingData.specialRequests ? `
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Special Requests</h3>
            <p style="color: #1e40af; margin: 0; white-space: pre-wrap;">${bookingData.specialRequests}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Action Required</h3>
            <p style="color: #92400e; margin: 0;">
              Please log in to your owner dashboard to confirm or reject this booking request. 
              You can set the final check-in and check-out times when confirming the booking.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/house-details" 
               style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Booking Dashboard
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">This is an automated notification from Smart Boarding Finder System</p>
          <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
        </div>
      </div>
    `;

    const result = await sendEmail(ownerEmail, subject, html);
    if (result) {
      console.log('✅ Booking notification email sent to owner:', ownerEmail);
    } else {
      console.log('❌ Failed to send booking notification email');
    }
  } catch (error) {
    console.error('❌ Error sending booking notification email:', error);
  }
};

// Send booking status notification email to user
const sendBookingStatusNotificationEmail = async (userEmail, userName, bookingData, status) => {
  try {
    console.log('📧 Sending booking status notification to user:', userEmail);
    console.log('Status:', status, 'Booking:', bookingData.id);

    let subject, html;
    
    if (status === 'confirmed') {
      subject = `✅ Booking Confirmed - ${bookingData.houseTitle}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Smart Boarding Finder System</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Great news! Your booking request has been confirmed by the property owner.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Property Details</h3>
              <p style="margin: 8px 0;"><strong>Property:</strong> ${bookingData.houseTitle}</p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${bookingData.houseAddress}</p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Booking Details</h3>
              <p style="margin: 8px 0;"><strong>Check-in Date:</strong> ${new Date(bookingData.checkIn).toLocaleDateString()}</p>
              <p style="margin: 8px 0;"><strong>Check-out Date:</strong> ${new Date(bookingData.checkOut).toLocaleDateString()}</p>
              ${bookingData.checkInTime ? `<p style="margin: 8px 0;"><strong>Check-in Time:</strong> ${bookingData.checkInTime}</p>` : ''}
              ${bookingData.checkOutTime ? `<p style="margin: 8px 0;"><strong>Check-out Time:</strong> ${bookingData.checkOutTime}</p>` : ''}
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Payment Information</h3>
              <p style="margin: 8px 0;"><strong>Total Amount:</strong> Rs. ${bookingData.totalAmount}</p>
              <p style="margin: 8px 0;"><strong>Advance Payment:</strong> Rs. ${bookingData.advancePayment}</p>
              <p style="margin: 8px 0;"><strong>Service Charge:</strong> Rs. ${bookingData.serviceCharge}</p>
              <p style="margin: 8px 0; font-size: 18px; color: #10b981;"><strong>Total Payment:</strong> Rs. ${bookingData.totalPayment}</p>
            </div>
            
            ${bookingData.specialRequests ? `
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Your Special Requests</h3>
              <p style="color: #1e40af; margin: 0; white-space: pre-wrap;">${bookingData.specialRequests}</p>
            </div>
            ` : ''}
            
            <div style="background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin-top: 0;">📋 What's Next?</h3>
              <ul style="color: #065f46; margin: 0; padding-left: 20px;">
                <li>Mark your check-in date on your calendar</li>
                <li>Contact the property owner if you need to reschedule</li>
                <li>Prepare any questions about the property</li>
                <li>Arrive on time for your check-in</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/user-profile" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View My Bookings
              </a>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">This is an automated notification from Smart Boarding Finder System</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
          </div>
        </div>
      `;
    } else if (status === 'rejected') {
      subject = `❌ Booking Update - ${bookingData.houseTitle}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Booking Update</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Smart Boarding Finder System</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We're sorry to inform you that your booking request has been declined by the property owner.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Property Details</h3>
              <p style="margin: 8px 0;"><strong>Property:</strong> ${bookingData.houseTitle}</p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${bookingData.houseAddress}</p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Booking Details</h3>
              <p style="margin: 8px 0;"><strong>Requested Check-in:</strong> ${new Date(bookingData.checkIn).toLocaleDateString()}</p>
              <p style="margin: 8px 0;"><strong>Requested Check-out:</strong> ${new Date(bookingData.checkOut).toLocaleDateString()}</p>
            </div>
            
            ${bookingData.rejectionReason ? `
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Owner's Message</h3>
              <p style="color: #dc2626; margin: 0; white-space: pre-wrap;">${bookingData.rejectionReason}</p>
            </div>
            ` : ''}
            
            <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">🔍 Don't Give Up!</h3>
              <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                <li>Browse other similar properties in the area</li>
                <li>Try different dates or times for the same property</li>
                <li>Contact the owner directly for more information</li>
                <li>Check our latest listings for new opportunities</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Browse More Properties
              </a>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">This is an automated notification from Smart Boarding Finder System</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
          </div>
        </div>
      `;
    }

    const result = await sendEmail(userEmail, subject, html);
    if (result) {
      console.log('✅ Booking status notification email sent to user:', userEmail);
    } else {
      console.log('❌ Failed to send booking status notification email');
    }
  } catch (error) {
    console.error('❌ Error sending booking status notification email:', error);
  }
};

// ============================
// @desc Create visit booking
// @route POST /api/bookings/visit
// ============================
const createVisitBooking = async (req, res) => {
  try {
    const { houseId, visitDate, type = 'visit', userId } = req.body;

    console.log('=== CREATE VISIT BOOKING ===');
    console.log('Data:', { houseId, visitDate, type, userId });

    // Validation
    if (!houseId || !visitDate) {
      return res.status(400).json({
        success: false,
        message: 'House ID and visit date are required'
      });
    }

    // Check if house exists
    const [houseRows] = await pool.query('SELECT * FROM houses WHERE id = ?', [houseId]);
    if (houseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }

    const house = houseRows[0];

    // Insert visit booking
    const insertQuery = `
      INSERT INTO bookings (
        house_id, visit_date, status, user_id
      ) VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      houseId, visitDate, 'pending', userId || null
    ]);

    console.log('✅ Visit booking created with ID:', result.insertId);

    res.json({
      success: true,
      message: 'Visit booking created successfully',
      booking: {
        id: result.insertId,
        houseId,
        visitDate,
        status: 'pending',
        house: {
          title: house.title,
          address: house.address
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating visit booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create visit booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Create stay booking
// @route POST /api/bookings/stay
// ============================
const createStayBooking = async (req, res) => {
  try {
    const { houseId, checkIn, checkOut, userId, totalAmount, advancePayment, serviceCharge, totalPayment, checkInTime, checkOutTime, specialRequests } = req.body;

    console.log('=== CREATE STAY BOOKING ===');
    console.log('Data:', { houseId, checkIn, checkOut, userId, totalAmount, advancePayment, serviceCharge, totalPayment, checkInTime, checkOutTime, specialRequests });

    // Validation
    if (!houseId || !checkIn || !checkOut || !userId) {
      return res.status(400).json({
        success: false,
        message: 'House ID, check-in, check-out dates, and user ID are required'
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check if house exists and get owner ID
    const [houseRows] = await pool.query('SELECT * FROM houses WHERE id = ?', [houseId]);
    if (houseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'House not found'
      });
    }

    const house = houseRows[0];

    // Check if short-term booking is available
    if (!house.shortTerm || house.pricePerNight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Short-term booking is not available for this property'
      });
    }

    // Calculate pricing if not provided
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedTotalAmount = totalAmount || (nights * house.pricePerNight);
    const calculatedAdvancePayment = advancePayment || (calculatedTotalAmount / 4);
    const calculatedServiceCharge = serviceCharge || (calculatedTotalAmount * 0.08);
    const calculatedTotalPayment = totalPayment || (calculatedAdvancePayment + calculatedServiceCharge);

    // Insert stay booking into booking_stay table
    const insertQuery = `
      INSERT INTO booking_stay (
        house_id, user_id, owner_id, check_in_date, check_out_date,
        total_amount, advance_payment, service_charge, total_payment,
        check_in_time, check_out_time, special_requests, status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      houseId, 
      userId, 
      house.owner_id, 
      checkIn, 
      checkOut,
      calculatedTotalAmount,
      calculatedAdvancePayment,
      calculatedServiceCharge,
      calculatedTotalPayment,
      checkInTime || null,
      checkOutTime || null,
      specialRequests || null,
      'pending',
      'pending'
    ]);

    console.log('✅ Stay booking created with ID:', result.insertId);

    // Get owner details for email notification
    const [ownerDetails] = await pool.query('SELECT name, email FROM owner WHERE id = ?', [house.owner_id]);
    const [userDetails] = await pool.query('SELECT first_name, last_name, email, phone FROM users WHERE id = ?', [userId]);

    // Send email notification to owner
    if (ownerDetails.length > 0 && userDetails.length > 0) {
      const bookingData = {
        houseTitle: house.title,
        houseAddress: house.address,
        userName: `${userDetails[0].first_name} ${userDetails[0].last_name}`,
        userEmail: userDetails[0].email,
        userContact: userDetails[0].phone,
        checkIn,
        checkOut,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        totalAmount: calculatedTotalAmount,
        advancePayment: calculatedAdvancePayment,
        serviceCharge: calculatedServiceCharge,
        totalPayment: calculatedTotalPayment,
        specialRequests: specialRequests || null
      };

      // Send email asynchronously (don't wait for it)
      sendBookingNotificationEmail(ownerDetails[0].email, ownerDetails[0].name, bookingData);
    }

    res.json({
      success: true,
      message: 'Stay booking request created successfully',
      booking: {
        id: result.insertId,
        houseId,
        userId,
        ownerId: house.owner_id,
        checkIn,
        checkOut,
        nights,
        totalAmount: calculatedTotalAmount,
        advancePayment: calculatedAdvancePayment,
        serviceCharge: calculatedServiceCharge,
        totalPayment: calculatedTotalPayment,
        status: 'pending',
        house: {
          title: house.title,
          address: house.address,
          pricePerNight: house.pricePerNight
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating stay booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create stay booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================
// @desc Get booking by ID
// @route GET /api/bookings/:id
// ============================
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT b.*, h.title as house_title, h.address as house_address,
             h.pricePerNight, h.owner_id,
             o.name as owner_name, o.contact as owner_phone, o.email as owner_email
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE b.id = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: rows[0]
    });

  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
};

// ============================
// @desc Update booking status
// @route PUT /api/bookings/:id/status
// ============================
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentId, paymentMethod } = req.body;

    console.log('=== UPDATE BOOKING STATUS ===');
    console.log('Booking ID:', id, 'New Status:', status);

    const validStatuses = ['pending', 'confirmed', 'paid', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let updateQuery = 'UPDATE bookings SET status = ?, updated_at = NOW()';
    let params = [status];

    // If payment related, add payment details
    if (status === 'paid' && paymentId) {
      updateQuery += ', payment_id = ?, payment_method = ?, paid_at = NOW()';
      params.push(paymentId, paymentMethod || 'online');
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    console.log('✅ Booking status updated successfully');

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
};

// ============================
// @desc Get bookings for a house
// @route GET /api/bookings/house/:houseId
// ============================
const getBookingsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT b.*, h.title as house_title, h.address as house_address
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      WHERE b.house_id = ?
    `;

    let params = [houseId];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error('❌ Error fetching bookings by house:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// ============================
// @desc Get all bookings with filters
// @route GET /api/bookings
// ============================
const getAllBookings = async (req, res) => {
  try {
    const { status, type, ownerId } = req.query;

    let query = `
      SELECT b.*, h.title as house_title, h.address as house_address,
             h.owner_id, o.name as owner_name, o.contact as owner_phone
      FROM bookings b
      JOIN houses h ON b.house_id = h.id
      LEFT JOIN owner o ON h.owner_id = o.id
      WHERE 1=1
    `;

    let params = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND b.type = ?';
      params.push(type);
    }

    if (ownerId) {
      query += ' AND h.owner_id = ?';
      params.push(ownerId);
    }

    query += ' ORDER BY b.created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      bookings: rows
    });

  } catch (error) {
    console.error('❌ Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
};

// ============================
// @desc Get stay bookings for owner
// @route GET /api/bookings/stay/owner/:ownerId
// ============================
const getStayBookingsForOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const query = `
      SELECT 
        bs.*,
        h.title as house_title,
        h.address as house_address,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.email as user_email,
        u.phone as user_contact
      FROM booking_stay bs
      JOIN houses h ON bs.house_id = h.id
      JOIN users u ON bs.user_id = u.id
      WHERE bs.owner_id = ?
      ORDER BY bs.created_at DESC
    `;

    const [bookings] = await pool.query(query, [ownerId]);

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('❌ Error fetching stay bookings for owner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stay bookings'
    });
  }
};

// ============================
// @desc Confirm stay booking
// @route PUT /api/bookings/stay/:id/confirm
// ============================
const confirmStayBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerMessage, checkInTime, checkOutTime } = req.body;

    console.log('=== CONFIRM STAY BOOKING ===');
    console.log('Booking ID:', id);
    if (checkInTime || checkOutTime) {
      console.log('Note: check-in/out times provided but are optional and will be ignored.');
    }
    if (ownerMessage) {
      console.log('Owner Message provided.');
    }

    const updateQuery = `
      UPDATE booking_stay 
      SET status = 'confirmed', 
          owner_message = ?,
          confirmed_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pending'
    `;

    const [result] = await pool.query(updateQuery, [ownerMessage || null, id]);
    console.log('Update result:', result);

    if (result.affectedRows === 0) {
      console.log('❌ No rows affected - booking not found or already processed');
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }

    console.log('✅ Booking confirmed successfully');

    // Get booking details for email notification
    const [bookingDetails] = await pool.query(`
      SELECT bs.*, u.first_name, u.last_name, u.email, h.title, h.address 
      FROM booking_stay bs
      JOIN users u ON bs.user_id = u.id
      JOIN houses h ON bs.house_id = h.id
      WHERE bs.id = ?
    `, [id]);

    if (bookingDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookingDetails[0];

    // Send email notification to user
    const bookingData = {
      id: booking.id,
      houseTitle: booking.title,
      houseAddress: booking.address,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      checkInTime: booking.check_in_time,
      checkOutTime: booking.check_out_time,
      totalAmount: booking.total_amount,
      advancePayment: booking.advance_payment,
      serviceCharge: booking.service_charge,
      totalPayment: booking.total_payment,
      specialRequests: booking.special_requests,
      ownerMessage: ownerMessage || booking.owner_message || null
    };

    const userName = `${booking.first_name} ${booking.last_name}`;
    
    // Send email asynchronously (don't wait for it)
    sendBookingStatusNotificationEmail(booking.email, userName, bookingData, 'confirmed');

    res.json({
      success: true,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('❌ Error confirming stay booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking'
    });
  }
};

// ============================
// @desc Reject stay booking
// @route PUT /api/bookings/stay/:id/reject
// ============================
const rejectStayBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log('=== REJECT STAY BOOKING ===');
    console.log('Booking ID:', id);
    console.log('Rejection Reason:', rejectionReason);

    // Validate required fields
    if (!rejectionReason || rejectionReason.trim() === '') {
      console.log('❌ Missing rejection reason');
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const updateQuery = `
      UPDATE booking_stay 
      SET status = 'rejected', 
          rejection_reason = ?,
          rejected_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pending'
    `;

    const [result] = await pool.query(updateQuery, [rejectionReason.trim(), id]);
    console.log('Update result:', result);

    if (result.affectedRows === 0) {
      console.log('❌ No rows affected - booking not found or already processed');
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }

    console.log('✅ Booking rejected successfully');

    // Get booking details for email notification
    const [bookingDetails] = await pool.query(`
      SELECT bs.*, u.first_name, u.last_name, u.email, h.title, h.address 
      FROM booking_stay bs
      JOIN users u ON bs.user_id = u.id
      JOIN houses h ON bs.house_id = h.id
      WHERE bs.id = ?
    `, [id]);

    if (bookingDetails.length > 0) {
      const booking = bookingDetails[0];
      
      // Send email notification to user
      const bookingData = {
        id: booking.id,
        houseTitle: booking.title,
        houseAddress: booking.address,
        checkIn: booking.check_in_date,
        checkOut: booking.check_out_date,
        rejectionReason: rejectionReason.trim()
      };

      const userName = `${booking.first_name} ${booking.last_name}`;
      
      // Send email asynchronously (don't wait for it)
      sendBookingStatusNotificationEmail(booking.email, userName, bookingData, 'rejected');
    }

    res.json({
      success: true,
      message: 'Booking rejected successfully'
    });

  } catch (error) {
    console.error('❌ Error rejecting stay booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject booking'
    });
  }
};

// ============================
// @desc Get stay bookings for user
// @route GET /api/bookings/stay/user/:userId
// ============================
const getStayBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        bs.*,
        h.title as house_title,
        h.address as house_address,
        h.images as house_images,
        o.name as owner_name,
        o.email as owner_email,
        o.contact as owner_contact
      FROM booking_stay bs
      JOIN houses h ON bs.house_id = h.id
      JOIN owner o ON bs.owner_id = o.id
      WHERE bs.user_id = ?
      ORDER BY bs.created_at DESC
    `;

    const [bookings] = await pool.query(query, [userId]);

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('❌ Error fetching stay bookings for user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user bookings'
    });
  }
};

// ============================
// @desc Update payment status
// @route PUT /api/bookings/stay/:id/payment
// ============================
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;

    console.log('=== UPDATE PAYMENT STATUS ===');
    console.log('Booking ID:', id);
    console.log('Payment Status:', payment_status);
    console.log('Payment Method:', payment_method);

    // Validate required fields
    if (!payment_status) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    // Update payment status in database
    const query = `
      UPDATE booking_stay 
      SET payment_status = ?, 
          payment_method = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await pool.query(query, [payment_status, payment_method || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    console.log('✅ Payment status updated successfully');

    // If paid, email the owner with payment details
    if (payment_status === 'paid') {
      try {
        const [rows] = await pool.query(`
          SELECT 
            bs.id,
            bs.total_payment,
            bs.payment_method,
            bs.check_in_date,
            bs.check_out_date,
            h.title AS house_title,
            h.address AS house_address,
            o.name AS owner_name,
            o.email AS owner_email,
            u.first_name, u.last_name, u.email AS user_email
          FROM booking_stay bs
          JOIN houses h ON bs.house_id = h.id
          JOIN owner o ON bs.owner_id = o.id
          JOIN users u ON bs.user_id = u.id
          WHERE bs.id = ?
        `, [id]);

        if (rows && rows.length > 0 && rows[0].owner_email) {
          const b = rows[0];
          const subject = `💳 Payment Received - Booking #${b.id}`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
              <div style="background:#0ea5e9;color:#fff;padding:16px 20px;text-align:center;border-radius:6px 6px 0 0;">
                <h2 style="margin:0;font-size:20px;">Payment Received</h2>
              </div>
              <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 6px 6px;">
                <p style="color:#111827;margin:0 0 12px 0;">Hello ${b.owner_name || 'Owner'},</p>
                <p style="color:#374151;margin:0 0 16px 0;">The guest <strong>${b.first_name} ${b.last_name}</strong> has completed the payment for their booking.</p>
                <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin-bottom:16px;">
                  <p style="margin:6px 0;color:#111827;"><strong>Booking ID:</strong> ${b.id}</p>
                  <p style="margin:6px 0;color:#111827;"><strong>Property:</strong> ${b.house_title}</p>
                  <p style="margin:6px 0;color:#111827;"><strong>Address:</strong> ${b.house_address}</p>
                  <p style="margin:6px 0;color:#111827;"><strong>Check-in:</strong> ${new Date(b.check_in_date).toLocaleDateString()}</p>
                  <p style="margin:6px 0;color:#111827;"><strong>Check-out:</strong> ${new Date(b.check_out_date).toLocaleDateString()}</p>
                  <p style="margin:6px 0;color:#0f766e;font-size:16px;"><strong>Total Paid:</strong> Rs. ${b.total_payment}</p>
                  <p style="margin:6px 0;color:#111827;"><strong>Payment Method:</strong> ${payment_method || b.payment_method || 'online'}</p>
                </div>
                <p style="color:#374151;margin:0;">You can now confirm the booking in your dashboard.</p>
              </div>
            </div>
          `;
          await sendEmail(b.owner_email, subject, html);
          console.log('📧 Payment notification sent to owner:', b.owner_email);
        }
      } catch (emailErr) {
        console.error('❌ Failed to send payment notification to owner:', emailErr);
      }
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

module.exports = {
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
};