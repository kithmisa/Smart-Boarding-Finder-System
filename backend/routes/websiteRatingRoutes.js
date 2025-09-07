const express = require('express');
const router = express.Router();
const { testConnection, submitRating, getRatingStats, getRecentRatings, deleteRating } = require('../controllers/websiteRatingController');

// Test database connection
router.get('/test', testConnection);

// Submit a website rating (public endpoint)
router.post('/submit', submitRating);

// Get website rating statistics (public endpoint)
router.get('/stats', getRatingStats);

// Get recent ratings (admin endpoint - can be protected later)
router.get('/recent', getRecentRatings);

// Delete a rating (admin endpoint)
router.delete('/:id', deleteRating);

module.exports = router;