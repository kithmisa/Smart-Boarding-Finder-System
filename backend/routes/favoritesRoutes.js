const express = require('express');
const router = express.Router();
const { checkFavoriteStatus, toggleFavorite, getUserFavorites } = require('../controllers/favoritesController');

// Check if a house is in user's favorites
router.get('/check/:houseId', checkFavoriteStatus);

// Toggle favorite (add/remove)
router.post('/toggle', toggleFavorite);

// Get user's favorites
router.get('/user/:userId', getUserFavorites);

module.exports = router;








