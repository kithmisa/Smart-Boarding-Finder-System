const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory storage for development
const otpStorage = new Map();

// Email transporter setup (supports Mailtrap, generic SMTP, or Gmail)
const createTransporter = () => {
  // Prefer Mailtrap in development if configured
  if (
    process.env.MAILTRAP_HOST &&
    process.env.MAILTRAP_USER &&
    process.env.MAILTRAP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || '2525', 10),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  // Generic SMTP support
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase();
    const isSecure = smtpSecure === 'true' || smtpSecure === '1' || process.env.SMTP_PORT === '465';
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to Gmail (requires App Password when 2FA enabled)
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

// Send OTP to email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email.toLowerCase(), {
      otp,
      expiry: otpExpiry,
      attempts: 0
    });

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.MAIL_FROM || {
        name: 'House Registration System',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Email Verification - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">🏠 House Registration</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Your email verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background-color: #2563eb; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; font-family: monospace;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This OTP expires in 10 minutes. Don't share this code with anyone.
            </p>
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
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const emailKey = email.toLowerCase();
    const storedData = otpStorage.get(emailKey);

    if (!storedData) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

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

    // Success
    otpStorage.delete(emailKey);
    console.log(`✅ OTP verified for ${email}`);

    res.status(200).json({
      message: 'Email verified successfully',
      email: email
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
};

module.exports = { sendOTP, verifyOTP };