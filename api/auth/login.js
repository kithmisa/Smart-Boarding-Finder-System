// Vercel Function: User Login
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    // Find user by email or username
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${emailOrUsername} OR username = ${emailOrUsername}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification code.' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update status to active if it was inactive
    if (user.status === 'inactive') {
      await sql`
        UPDATE users 
        SET status = 'active' 
        WHERE id = ${user.id}
      `;
      user.status = 'active';
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
}
