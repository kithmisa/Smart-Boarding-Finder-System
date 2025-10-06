// Vercel Function: Send OTP
import nodemailer from 'nodemailer';
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
    const { email, purpose = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    const emailKey = email.toLowerCase();
    otpStorage.set(emailKey, {
      otp,
      expiry: otpExpiry,
      attempts: 0,
      purpose: purpose
    });

    // Send email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: {
        name: 'Smart Boarding Finder',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your OTP Code - Smart Boarding Finder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B4513; text-align: center;">🏠 Smart Boarding Finder</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px;">Your verification code is:</p>
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

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP: ' + error.message });
  }
}
