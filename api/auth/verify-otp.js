// Vercel Function: Verify OTP
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

// In-memory storage for development (in production, use Redis or database)
const otpStorage = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, otp, purpose = 'verification' } = req.body;

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

    // Verify OTP
    if (storedData.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP code. Please try again.' });
    }

    // Success - handle based on purpose
    if (purpose === 'verification') {
      // Update user verification status
      await sql`
        UPDATE users 
        SET email_verified = TRUE, status = 'active' 
        WHERE email = ${email}
      `;

      // Delete OTP
      otpStorage.delete(emailKey);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        email: email
      });
    } else if (purpose === 'password_reset') {
      // Keep OTP for password reset
      res.status(200).json({
        success: true,
        message: 'OTP verified for password reset',
        email: email
      });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP: ' + error.message });
  }
}
