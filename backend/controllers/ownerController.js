const db = require('../db');

const registerOwner = async (req, res) => {
  const { name, email, nic, contact } = req.body;

  if (!name || !email || !nic || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if NIC already exists
    const [existing] = await db.query('SELECT nic FROM owner WHERE nic = ?', [nic]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'NIC already registered' });
    }

    await db.query('INSERT INTO owner (name, email, nic, contact) VALUES (?, ?, ?, ?)', [
      name, email, nic, contact,
    ]);
    res.status(201).json({ message: 'Owner registered successfully' });
  } catch (err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const loginOwner = async (req, res) => {
  const { nic } = req.body;

  if (!nic) {
    return res.status(400).json({ error: 'NIC is required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM owner WHERE nic = ?', [nic]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'NIC not found' });
    }
    res.status(200).json({ message: 'Login success', owner: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerOwner, loginOwner };
