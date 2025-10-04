// Vercel Function: Submit Contact Form
import { sql } from '@vercel/postgres';

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
    const { name, email, title, comments } = req.body;

    // Validation
    if (!name || !email || !title || !comments) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Insert contact message
    const result = await sql`
      INSERT INTO contact_messages (name, email, title, comments) 
      VALUES (${name}, ${email}, ${title}, ${comments})
      RETURNING id
    `;

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      id: result.rows[0].id
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message: ' + error.message 
    });
  }
}
