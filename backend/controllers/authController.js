const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const db = require('../db');

// In-memory storage for development
const otpStorage = new Map();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiry) {
      otpStorage.delete(email);
      console.log('🧹 Cleaned up expired OTP for:', email);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Debug endpoint to check OTP storage (remove in production)
const debugOTPStorage = async (req, res) => {
  try {
    const storageInfo = {};
    for (const [email, data] of otpStorage.entries()) {
      storageInfo[email] = {
        otp: data.otp,
        expiry: new Date(data.expiry).toISOString(),
        attempts: data.attempts,
        isExpired: Date.now() > data.expiry
      };
    }
    
    res.status(200).json({
      storageSize: otpStorage.size,
      storage: storageInfo
    });
  } catch (error) {
    res.status(500).json({ error: 'Debug failed: ' + error.message });
  }
};

// Clear OTP for specific email and purpose (for testing)
const clearOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailKey = email.toLowerCase();
    const existingOTP = otpStorage.get(emailKey);
    
    if (!existingOTP) {
      return res.status(404).json({ error: 'No OTP found for this email' });
    }
    
    if (purpose && existingOTP.purpose !== purpose) {
      return res.status(400).json({ error: 'OTP purpose mismatch' });
    }
    
    otpStorage.delete(emailKey);
    console.log('🗑️ OTP cleared for:', emailKey, 'purpose:', existingOTP.purpose);
    
    res.status(200).json({
      message: 'OTP cleared successfully',
      email: email,
      purpose: existingOTP.purpose
    });
  } catch (error) {
    console.error('Clear OTP error:', error);
    res.status(500).json({ error: 'Failed to clear OTP: ' + error.message });
  }
};

// Send OTP to email
const sendOTP = async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if OTP already exists and is not expired for the same purpose
    const emailKey = email.toLowerCase();
    const existingOTP = otpStorage.get(emailKey);
    
    // For email_change purpose, allow resending OTP by replacing the existing one
    if (existingOTP && Date.now() < existingOTP.expiry && existingOTP.purpose === purpose) {
      if (purpose === 'email_change') {
        console.log('🔄 Replacing existing email change OTP for:', emailKey);
        // Remove the existing OTP to allow a new one
        otpStorage.delete(emailKey);
      } else {
        console.log('⚠️  OTP already exists for email:', emailKey, 'purpose:', purpose);
        return res.status(400).json({ 
          error: 'OTP already sent. Please check your email or wait for it to expire.' 
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with purpose
    otpStorage.set(emailKey, {
      otp,
      expiry: otpExpiry,
      attempts: 0,
      purpose: purpose
    });
    
    console.log('💾 OTP stored:', { 
      emailKey, 
      otp, 
      expiry: new Date(otpExpiry).toISOString(),
      storageSize: otpStorage.size 
    });

    // Create transporter
    const transporter = createTransporter();

    // Email content based on purpose
    const isPasswordReset = purpose === 'password_reset';
    const subject = isPasswordReset ? 'Password Reset - Your OTP Code' : 'Email Verification - Your OTP Code';
    const message = isPasswordReset ? 'Your password reset code is:' : 'Your email verification code is:';
    
    const mailOptions = {
      from: {
        name: 'Smart Boarding Finder',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B4513; text-align: center;">🏠 Smart Boarding Finder</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">${message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #8B4513; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; font-family: monospace;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This OTP expires in 10 minutes. Don't share this code with anyone.
            </p>
            ${isPasswordReset ? '<p style="font-size: 14px; color: #666;"><strong>Note:</strong> This code is for password reset only.</p>' : ''}
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}: ${otp}`);

    res.status(200).json({
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP: ' + error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    console.log('🔍 OTP verification request:', { body: req.body, email: req.body.email, otp: req.body.otp });
    
    const { email, otp, purpose = 'verification' } = req.body;

    if (!email || !otp) {
      console.log('❌ Missing email or OTP:', { email: !!email, otp: !!otp });
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const emailKey = email.toLowerCase();
    const storedData = otpStorage.get(emailKey);
    
    console.log('🔍 OTP storage check:', { 
      emailKey, 
      hasStoredData: !!storedData, 
      storedOtp: storedData?.otp,
      storedExpiry: storedData?.expiry,
      currentTime: Date.now()
    });

    if (!storedData) {
      console.log('❌ No OTP found for email:', emailKey);
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP purpose matches. Backward-compat: legacy OTPs may not have a purpose; treat as 'verification'.
    const storedPurpose = storedData.purpose || 'verification';
    if (storedPurpose !== purpose) {
      console.log('❌ OTP purpose mismatch:', { stored: storedPurpose, requested: purpose });
      return res.status(400).json({ error: 'Invalid OTP purpose. Please request a new one.' });
    }

    console.log('🔍 OTP purpose check passed:', { stored: storedData.purpose, requested: purpose });

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStorage.delete(emailKey);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStorage.delete(emailKey);
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedData.otp !== otp.trim()) {
      storedData.attempts++;
      otpStorage.set(emailKey, storedData);
      return res.status(400).json({ 
        error: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
      });
    }

    // Success - handle based on purpose
    console.log(`✅ OTP verified for ${email}, purpose: ${purpose}`);

    if (purpose === 'verification') {
      // Delete OTP after successful verification (account activation)
      console.log('🗑️  Deleting OTP for email verification (account activation)');
      otpStorage.delete(emailKey);
      
      // Update user verification status and activate account in database
      try {
        const connection = await db.getConnection();
        try {
          await connection.execute(
            'UPDATE users SET email_verified = TRUE, status = "active" WHERE email = ?',
            [email]
          );

          // Fetch user to return in response (without password)
          const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
          );

          let user = users && users.length > 0 ? users[0] : null;

          if (!user) {
            console.warn('⚠️ Verified email but user not found when fetching:', email);
            return res.status(200).json({ message: 'Email verified successfully', email });
          }

          // Generate a simple token (non-JWT) similar to loginUser
          const token = crypto.randomBytes(32).toString('hex');

          // Remove password fields
          const { password_hash, reset_token, reset_token_expiry, ...userWithoutSensitive } = user;

          console.log('✅ User account activated and token issued:', email);

          return res.status(200).json({
            message: 'Email verified successfully',
            email,
            token,
            user: userWithoutSensitive
          });
        } finally {
          connection.release();
        }
      } catch (dbError) {
        console.error('Database error during verification response:', dbError);
        // Still return success for verification, but without token
        return res.status(200).json({ message: 'Email verified successfully', email });
      }
    } else if (purpose === 'password_reset') {
      // For password reset, DON'T delete OTP yet - keep it for the actual password reset
      // The OTP will be deleted in resetPasswordWithOTP after successful password update
      console.log('💾 Keeping OTP in storage for password reset:', { emailKey, purpose });
      res.status(200).json({
        message: 'OTP verified for password reset',
        email: email
      });
    } else if (purpose === 'email_change') {
      // For email change, delete OTP after successful verification
      console.log('🗑️ Deleting OTP for email change verification:', { emailKey, purpose });
      otpStorage.delete(emailKey);
      
      res.status(200).json({
        message: 'Email change OTP verified successfully',
        email: email
      });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if user already exists
    const connection = await db.getConnection();
    
    try {
      // Insert new user (initially unverified) - allowing duplicates as requested
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password_hash, first_name, last_name, phone, email_verified, status) VALUES (?, ?, ?, ?, ?, ?, FALSE, "inactive")',
        [username, email, hashedPassword, firstName, lastName, phone || null]
      );

      const userId = result.insertId;

          // Send OTP for email verification
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with email as key
    const emailKey = email.toLowerCase();
    otpStorage.set(emailKey, {
      otp,
      expiry: otpExpiry,
      attempts: 0,
      purpose: 'verification'
    });
    
    console.log('💾 OTP stored during registration:', { 
      emailKey, 
      otp, 
      expiry: new Date(otpExpiry).toISOString(),
      storageSize: otpStorage.size 
    });

      // Send verification email
      const transporter = createTransporter();
      const mailOptions = {
        from: {
          name: 'Smart Boarding Finder',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify Your Email - Smart Boarding Finder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513; text-align: center;">🏠 Smart Boarding Finder</h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 16px;">Hello ${firstName},</p>
              <p style="font-size: 16px;">Welcome to Smart Boarding Finder! Please verify your email address by entering this code:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="background-color: #8B4513; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; font-family: monospace;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 14px; color: #666;">
                This code expires in 10 minutes. Don't share this code with anyone.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        userId: userId,
        email: email
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Find user by email or username
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [emailOrUsername, emailOrUsername]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      // Check if email is verified
      if (!user.email_verified) {
        return res.status(401).json({ 
          error: 'Please verify your email before logging in. Check your inbox for the verification code.' 
        });
      }

      // Verify password first
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update status to active if it was inactive (after email verification)
      if (user.status === 'inactive') {
        await connection.execute(
          'UPDATE users SET status = "active" WHERE id = ?',
          [user.id]
        );
        user.status = 'active';
        console.log('✅ User status updated to active:', user.email);
      }

      // Generate JWT token (you can implement this later)
      const token = crypto.randomBytes(32).toString('hex');

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login successful',
        token: token,
        user: userWithoutPassword
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const connection = await db.getConnection();
    
    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id, first_name FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        // Don't reveal if email exists or not
        return res.status(200).json({ 
          message: 'If an account exists with this email, a password reset link has been sent.' 
        });
      }

      const user = users[0];

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

      // Store reset token in database
      await connection.execute(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [resetToken, new Date(resetExpiry), user.id]
      );

      // Send reset email
      const transporter = createTransporter();
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: {
          name: 'Smart Boarding Finder',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset Request - Smart Boarding Finder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8B4513; text-align: center;">🏠 Smart Boarding Finder</h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 16px;">Hello ${user.first_name},</p>
              <p style="font-size: 16px;">You requested a password reset. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #8B4513; color: white; padding: 15px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                This link expires in 1 hour. If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message: 'If an account exists with this email, a password reset link has been sent.'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request: ' + error.message });
  }
};

// Reset password with token (legacy method)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const connection = await db.getConnection();
    
    try {
      // Find user with valid reset token
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [token]
      );

      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const user = users[0];

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await connection.execute(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, user.id]
      );

      res.status(200).json({
        message: 'Password reset successfully. You can now login with your new password.'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password: ' + error.message });
  }
};

// Reset password with OTP (new method)
const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    console.log('🔐 Password reset request:', { email, otp: otp.substring(0, 2) + '****', passwordLength: newPassword.length });

    // Verify OTP first
    const emailKey = email.toLowerCase();
    console.log('🔍 Looking for OTP with email key:', emailKey);
    
    // Log all stored OTPs for debugging
    console.log('📋 All stored OTPs:');
    for (const [key, data] of otpStorage.entries()) {
      console.log(`   ${key}:`, { 
        otp: data.otp, 
        purpose: data.purpose, 
        expiry: new Date(data.expiry).toISOString(),
        isExpired: Date.now() > data.expiry
      });
    }
    
    const storedData = otpStorage.get(emailKey);
    
    console.log('🔍 OTP storage check in resetPasswordWithOTP:', { 
      emailKey, 
      hasStoredData: !!storedData, 
      storedOtp: storedData?.otp,
      storedPurpose: storedData?.purpose,
      storedExpiry: storedData?.expiry,
      currentTime: Date.now(),
      storageSize: otpStorage.size
    });
    
    if (!storedData) {
      console.log('❌ No OTP found for email:', emailKey);
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP purpose matches
    if (storedData.purpose !== 'password_reset') {
      console.log('❌ OTP purpose mismatch:', { stored: storedData.purpose, requested: 'password_reset' });
      return res.status(400).json({ error: 'Invalid OTP purpose. Please request a new OTP for password reset.' });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStorage.delete(emailKey);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (storedData.otp !== otp.trim()) {
      console.log('❌ Invalid OTP for password reset');
      return res.status(400).json({ error: 'Invalid OTP code. Please try again.' });
    }

    // OTP verified, now reset password
    const connection = await db.getConnection();
    
    try {
      // Find user by email
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(400).json({ error: 'User not found with this email address.' });
      }

      const user = users[0];

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await connection.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedPassword, user.id]
      );

      // Remove OTP from storage
      otpStorage.delete(emailKey);

      console.log('✅ Password reset successfully for user:', email);

      res.status(200).json({
        message: 'Password reset successfully. You can now login with your new password.'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Reset password with OTP error:', error);
    res.status(500).json({ error: 'Failed to reset password: ' + error.message });
  }
};

module.exports = { 
  sendOTP, 
  verifyOTP, 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  resetPasswordWithOTP,
  debugOTPStorage,
  clearOTP
};