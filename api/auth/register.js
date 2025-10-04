// Vercel Function: User Registration
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

    // Insert new user (initially unverified)
    const result = await sql`
      INSERT INTO users (username, email, password_hash, first_name, last_name, phone, email_verified, status) 
      VALUES (${username}, ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${phone || null}, FALSE, 'inactive')
      RETURNING id
    `;

    const userId = result.rows[0].id;

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in database (you might want to create an otp table)
    // For now, we'll use a simple approach
    await sql`
      INSERT INTO users (email, reset_token, reset_token_expiry) 
      VALUES (${email}, ${otp}, ${new Date(Date.now() + 10 * 60 * 1000)})
      ON CONFLICT (email) 
      DO UPDATE SET reset_token = ${otp}, reset_token_expiry = ${new Date(Date.now() + 10 * 60 * 1000)}
    `;

    // Send verification email
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

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
}
