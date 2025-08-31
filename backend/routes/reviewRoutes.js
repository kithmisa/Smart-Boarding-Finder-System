const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all reviews for a specific boarding place
router.get('/boarding/:boardingId', async (req, res) => {
  try {
    const { boardingId } = req.params;
    
    // Get reviews with user information
    const [reviews] = await db.execute(`
      SELECT r.*, u.username as userName, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.boarding_id = ?
      ORDER BY r.created_at DESC
    `, [boardingId]);
    
    // Calculate average rating
    const [ratingResult] = await db.execute(`
      SELECT 
        AVG(rating) as averageRating,
        COUNT(*) as totalReviews
      FROM reviews 
      WHERE boarding_id = ?
    `, [boardingId]);
    
    const averageRating = ratingResult[0]?.averageRating || 0;
    const totalReviews = ratingResult[0]?.totalReviews || 0;
    
    res.json({
      success: true,
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { 
      boardingId, 
      userId, 
      rating, 
      title, 
      comment, 
      cleanliness, 
      location, 
      value, 
      amenities 
    } = req.body;
    
    // Validate required fields
    if (!boardingId || !userId || !rating || !cleanliness || !location || !value || !amenities) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Check if user already reviewed this boarding place
    const [existingReview] = await db.execute(`
      SELECT id FROM reviews 
      WHERE user_id = ? AND boarding_id = ?
    `, [userId, boardingId]);
    
    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this boarding place'
      });
    }
    
    // Insert new review
    const [result] = await db.execute(`
      INSERT INTO reviews (boarding_id, user_id, rating, title, comment, cleanliness, location, value, amenities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [boardingId, userId, rating, title, comment, cleanliness, location, value, amenities]);
    
    res.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit review' 
    });
  }
});

// Update an existing review
router.put('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { 
      rating, 
      title, 
      comment, 
      cleanliness, 
      location, 
      value, 
      amenities 
    } = req.body;
    
    // Update review
    await db.execute(`
      UPDATE reviews 
      SET rating = ?, title = ?, comment = ?, cleanliness = ?, location = ?, value = ?, amenities = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [rating, title, comment, cleanliness, location, value, amenities, reviewId]);
    
    res.json({
      success: true,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update review' 
    });
  }
});

// Delete a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    await db.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete review' 
    });
  }
});

// Get review statistics for a boarding place
router.get('/boarding/:boardingId/stats', async (req, res) => {
  try {
    const { boardingId } = req.params;
    
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as totalReviews,
        AVG(rating) as averageRating,
        AVG(cleanliness) as avgCleanliness,
        AVG(location) as avgLocation,
        AVG(value) as avgValue,
        AVG(amenities) as avgAmenities,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as fiveStar,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as fourStar,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as threeStar,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as twoStar,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as oneStar
      FROM reviews 
      WHERE boarding_id = ?
    `, [boardingId]);
    
    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch review statistics' 
    });
  }
});

module.exports = router;







