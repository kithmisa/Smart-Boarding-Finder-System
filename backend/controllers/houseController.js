const pool = require('../db');

// =======================
// @desc Add a new house linked to owner NIC
// @route POST /api/houses
// =======================
const addHouse = async (req, res) => {
  try {
    const {
      title,
      roomType,
      genderAllowed,
      price,
      address,
      city,
      type,
      location,
      highlights,
      shortTerm,
      pricePerNight,
      description,
      features,
      shortFeatures,
      nic
    } = req.body;

    if (!nic) {
      return res.status(400).json({ error: 'Owner NIC is required' });
    }

    if (!title || !roomType || !genderAllowed || !price || !address || !city || !type || !location) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if owner exists and get owner id
    const [owners] = await pool.query('SELECT id FROM owner WHERE nic = ?', [nic]);
    if (owners.length === 0) {
      return res.status(404).json({ error: 'Owner with given NIC not found' });
    }
    const ownerId = owners[0].id;

    const featuresArr = features ? JSON.parse(features) : [];
    const shortFeaturesArr = shortFeatures ? JSON.parse(shortFeatures) : [];
    const images = req.files || [];
    const imagePaths = JSON.stringify(images.map(file => file.filename));

    const isShortTerm = shortTerm === 'true' || shortTerm === true ? 1 : 0;

    const sql = `
      INSERT INTO houses (
        owner_id, title, roomType, genderAllowed, price, address, city, type,
        location, highlights, shortTerm, pricePerNight, description,
        features, shortFeatures, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      ownerId,
      title,
      roomType,
      genderAllowed,
      price,
      address,
      city,
      type,
      location,
      highlights || '',
      isShortTerm,
      pricePerNight || 0,
      description || '',
      JSON.stringify(featuresArr),
      JSON.stringify(shortFeaturesArr),
      imagePaths
    ]);

    res.status(201).json({ message: '✅ House added', houseId: result.insertId });
  } catch (error) {
    console.error('❌ Error adding house:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Other controller methods remain same as you provided:
const getAllHouses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM houses ORDER BY created_at DESC');

    const formatted = rows.map(house => {
      let parsedImages;
      try {
        parsedImages = JSON.parse(house.images);
      } catch {
        parsedImages = house.images?.split(',') || [];
      }
      return {
        ...house,
        images: parsedImages,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching houses:', err);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
};

const getOwnerHouses = async (req, res) => {
  const { nic } = req.params;
  try {
    // Get owner id by nic
    const [owners] = await pool.query('SELECT id FROM owner WHERE nic = ?', [nic]);
    if (owners.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    const ownerId = owners[0].id;

    const [rows] = await pool.query('SELECT * FROM houses WHERE owner_id = ?', [ownerId]);

    const formatted = rows.map(house => {
      let parsedImages;
      try {
        parsedImages = JSON.parse(house.images);
      } catch {
        parsedImages = house.images?.split(',') || [];
      }
      return {
        ...house,
        images: parsedImages,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching owner houses:', err);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
};

const updateHouse = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [result] = await pool.query('UPDATE houses SET ? WHERE id = ?', [updates, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json({ message: 'House updated successfully' });
  } catch (err) {
    console.error('❌ Error updating house:', err);
    res.status(500).json({ error: 'Failed to update house' });
  }
};

const deleteHouse = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM houses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json({ message: 'House deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting house:', err);
    res.status(500).json({ error: 'Failed to delete house' });
  }
};

const updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { status, availableDate } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE houses SET availabilityStatus = ?, availableDate = ? WHERE id = ?',
      [status, availableDate || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    res.json({ message: 'Availability updated successfully' });
  } catch (err) {
    console.error('❌ Error updating availability:', err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

module.exports = {
  addHouse,
  getAllHouses,
  getOwnerHouses,
  updateHouse,
  deleteHouse,
  updateAvailability,
};
