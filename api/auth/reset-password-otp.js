// Vercel Function: Reset Password with OTP
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

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
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword} 
      WHERE email = ${email}
    `;

    // Delete OTP
    otpStorage.delete(emailKey);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password: ' + error.message });
  }
}
