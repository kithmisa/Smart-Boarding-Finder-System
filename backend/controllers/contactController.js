const db = require('../db');

const submitContactForm = async (req, res) => {
  const { name, email, title, comments } = req.body;

  if (!name || !email || !title || !comments) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO contact_messages (name, email, title, comments) VALUES (?, ?, ?, ?)',
      [name, email, title, comments]
    );
    res.status(200).json({ message: 'Contact message submitted successfully', id: result.insertId });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

module.exports = { submitContactForm };
