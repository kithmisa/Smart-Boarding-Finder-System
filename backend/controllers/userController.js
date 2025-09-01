const db = require('../db');

// Get user profile details
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Get user basic info
      const [users] = await connection.execute(
        'SELECT id, username, email, first_name, last_name, phone, email_verified, status, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = users[0];

      // Get user's visit requests
      const [visitRequests] = await connection.execute(
        `SELECT vr.id, vr.requested_date, vr.requested_time, vr.status, vr.created_at, 
                h.title as house_title, h.address, h.price, vr.message, vr.owner_response
         FROM visit_requests vr
         JOIN houses h ON vr.boarding_id = h.id
         WHERE vr.user_id = ?
         ORDER BY vr.created_at DESC`,
        [userId]
      );

      // Get user's payments (commented out until payments table is created)
      // const [payments] = await connection.execute(
      //   `SELECT p.id, p.amount, p.payment_method, p.status, p.created_at
      //    FROM payments p
      //    WHERE p.user_id = ?
      //    ORDER BY p.created_at DESC`,
      //   [userId]
      // );
      const payments = []; // Empty array for now

             // Get user's favorite houses (assuming you have a favorites table)
       const [favorites] = await connection.execute(
         `SELECT h.id, h.title, h.address, h.price, h.created_at
          FROM houses h
          JOIN favorites f ON h.id = f.house_id
          WHERE f.user_id = ?
          ORDER BY f.created_at DESC`,
         [userId]
       );

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          email_verified: user.email_verified,
          status: user.status,
          created_at: user.created_at
        },
        visitRequests: visitRequests.map(request => ({
          id: request.id,
          requestedDate: request.requested_date,
          requestedTime: request.requested_time,
          status: request.status,
          createdAt: request.created_at,
          houseTitle: request.house_title,
          address: request.address,
          price: request.price,
          message: request.message,
          ownerResponse: request.owner_response
        })),
        payments: payments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          paymentMethod: payment.payment_method,
          status: payment.status,
          createdAt: payment.created_at,
          houseTitle: payment.house_title
        })),
                 favorites: favorites.map(favorite => ({
           id: favorite.id,
           title: favorite.title,
           address: favorite.address,
           price: favorite.price,
           createdAt: favorite.created_at
         }))
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile: ' + error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, firstName, lastName, phone } = req.body;

    console.log('📝 Profile update request:', { 
      userId, 
      body: req.body,
      username, 
      email, 
      firstName, 
      lastName, 
      phone 
    });

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!username || !email || !firstName || !lastName) {
      console.log('❌ Missing required fields:', { 
        username: username || 'MISSING', 
        email: email || 'MISSING', 
        firstName: firstName || 'MISSING', 
        lastName: lastName || 'MISSING',
        hasUsername: !!username, 
        hasEmail: !!email, 
        hasFirstName: !!firstName, 
        hasLastName: !!lastName 
      });
      return res.status(400).json({ 
        error: 'Username, email, first name and last name are required',
        details: {
          username: !!username,
          email: !!email,
          firstName: !!firstName,
          lastName: !!lastName
        }
      });
    }

    const connection = await db.getConnection();
    
    try {
      // Fetch current user values to determine if fields actually changed
      const [currentUserRows] = await connection.execute(
        'SELECT username, email FROM users WHERE id = ?',
        [userId]
      );

      if (currentUserRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentUser = currentUserRows[0];
      const usernameChanged = username !== currentUser.username;
      const emailChanged = email !== currentUser.email;

      // Check if username already exists for other users (only if changed)
      if (usernameChanged) {
        const [existingUsername] = await connection.execute(
          'SELECT id FROM users WHERE username = ? AND id != ?',
          [username, userId]
        );
  
        if (existingUsername.length > 0) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }

      // Check if email already exists for other users (only if changed)
      if (emailChanged) {
        console.log('🔍 Checking email conflicts:', { email, userId, userIdType: typeof userId });
        const [existingEmail] = await connection.execute(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, userId]
        );
        
        console.log('📊 Email check results:', { 
          existingEmailCount: existingEmail.length,
          existingEmailResults: existingEmail,
          queryParams: [email, userId]
        });
  
        if (existingEmail.length > 0) {
          console.log('❌ Email conflict found for user:', existingEmail[0]);
          return res.status(400).json({ error: 'Email already exists for another user' });
        }
      }

      // Update user profile
      await connection.execute(
        'UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, phone = ? WHERE id = ?',
        [username, email, firstName, lastName, phone, userId]
      );

      res.status(200).json({
        message: 'Profile updated successfully',
        user: { username, email, firstName, lastName, phone }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile: ' + error.message });
  }
};

// Get user's recent activity
const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Get recent bookings
      const [recentBookings] = await connection.execute(
        `SELECT b.id, b.visit_date, b.status, b.created_at, h.title as house_title
         FROM bookings b
         JOIN houses h ON b.house_id = h.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC
         LIMIT 5`,
        [userId]
      );

      // Get recent payments
      const [recentPayments] = await connection.execute(
        `SELECT p.id, p.amount, p.status, p.created_at, h.title as house_title
         FROM payments p
         JOIN houses h ON p.house_id = h.id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC
         LIMIT 5`,
        [userId]
      );

      res.status(200).json({
        recentBookings: recentBookings.map(booking => ({
          id: booking.id,
          visitDate: booking.visit_date,
          status: booking.status,
          createdAt: booking.created_at,
          houseTitle: booking.house_title
        })),
        recentPayments: recentPayments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          createdAt: payment.created_at,
          houseTitle: payment.house_title
        }))
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error getting user activity:', error);
    res.status(500).json({ error: 'Failed to get user activity: ' + error.message });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();

      try {
        // Delete user's favorites
        await connection.execute('DELETE FROM favorites WHERE user_id = ?', [userId]);
        
        // Delete user's bookings
        await connection.execute('DELETE FROM bookings WHERE user_id = ?', [userId]);
        
        // Delete user's payments
        await connection.execute('DELETE FROM payments WHERE user_id = ?', [userId]);
        
        // Finally delete the user
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
          throw new Error('User not found');
        }

        // Commit transaction
        await connection.commit();

        res.status(200).json({
          message: 'Account deleted successfully'
        });

      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        throw error;
      }

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete account: ' + error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserActivity,
  deleteUserAccount
};
