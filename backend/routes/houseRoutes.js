const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

//const { addHouse } = require('../controllers/houseController');
const { addHouse, getAllHouses } = require('../controllers/houseController');
const db = require('../db');


const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // folder to save images
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp + original name
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit 5MB per file
});

// Use multer middleware for multiple images under field name 'images'
router.post('/', upload.array('images', 10), addHouse);


router.get('/all', getAllHouses); // e.g., http://localhost:5000/api/houses/all

router.get('/owner/:nic', houseController.getOwnerHouses);


router.get('/:id', async (req, res) => {
  const houseId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM houses WHERE id = ?', [houseId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'House not found' });
    }

    const house = rows[0];

    // If you're storing image filenames as comma-separated string:
    if (house.images) {
      house.images = house.images.split(',');
    } else {
      house.images = [];
    }

    // If these are stored as JSON strings:
    house.features = house.features ? JSON.parse(house.features) : [];
    house.shortFeatures = house.shortFeatures ? JSON.parse(house.shortFeatures) : [];

    res.json(house);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/owner/:nic', houseController.getOwnerHouses); // 🆕 Get all listings by NIC
router.put('/:id', houseController.updateHouse);           // 🆕 Edit listing
router.delete('/:id', houseController.deleteHouse);        // 🆕 Delete listing
router.patch('/:id/availability', houseController.updateAvailability); // 🆕 Toggle availability

module.exports = router;
