import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaWhatsapp, FaInstagram, FaStar } from 'react-icons/fa';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = ({ isAuthenticated, user }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratingStats, setRatingStats] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Fetch rating statistics on component mount
  useEffect(() => {
    fetchRatingStats();
  }, []);

  const fetchRatingStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/website-ratings/stats');
      const data = await response.json();
      
      if (data.success) {
        setRatingStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setShowCommentInput(true);
    setError('');
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get user ID from localStorage if authenticated
      const userId = localStorage.getItem('user_id');
      
      console.log('=== FRONTEND RATING DEBUG ===');
      console.log('Rating value:', rating);
      console.log('Comment:', comment);
      console.log('User ID from localStorage:', userId);
      console.log('Is authenticated:', !!userId);
      
      const requestBody = {
        rating,
        comment: comment.trim() || null,
        userId: userId || null // Send user ID if authenticated, null if anonymous
      };
      
      console.log('Request body being sent:', requestBody);
      console.log('=== END FRONTEND DEBUG ===');
      
      const response = await fetch('http://localhost:5000/api/website-ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (data.success) {
        setSubmitted(true);
        setShowCommentInput(false);
        setComment('');
        // Refresh rating statistics
        fetchRatingStats();
      } else {
        setError(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRating(null);
    setHover(null);
    setSubmitted(false);
    setComment('');
    setError('');
    setShowCommentInput(false);
  };

  return (
    <footer className="bg-black bg-opacity-60 text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Branding, Socials & Rating */}
        <div>
          <h2 className="text-xl font-bold">Smart Boarding Finder</h2>
          <p className="mt-2 text-sm">Smart boarding solutions for University of Ruhuna students.</p>
          <div className="flex gap-4 mt-4 text-2xl">
            <FaWhatsapp />
            <FaInstagram />
            <FaFacebook />
          </div>

          {/* Rating Block (on left) */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Rate Our Website</h3>
            
            {/* Display current rating statistics */}
            {ratingStats && (
              <div className="mb-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400 font-semibold">{ratingStats.averageRating}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        color={index < Math.floor(ratingStats.averageRating) ? '#facc15' : '#d1d5db'}
                        size={12}
                      />
                    ))}
                  </div>
                  <span className="text-gray-300">({ratingStats.totalRatings} ratings)</span>
                </div>
              </div>
            )}

            {!submitted ? (
              <>
                <div className="flex gap-2 text-2xl">
                  {[...Array(5)].map((_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(null)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        disabled={loading}
                      >
                        <FaStar
                          color={value <= (hover || rating) ? '#facc15' : '#d1d5db'}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Comment input */}
                {showCommentInput && (
                  <div className="mt-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Optional: Tell us what you think..."
                      className="w-full p-2 text-sm text-black rounded border resize-none"
                      rows="2"
                      maxLength="200"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {comment.length}/200 characters
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <p className="text-red-400 mt-2 text-sm">{error}</p>
                )}

                {/* Submit button */}
                {rating && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 rounded text-xs transition-colors"
                    >
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-green-400 mt-2 text-sm">
                <p>Thanks for your feedback!</p>
                <button
                  onClick={handleReset}
                  className="text-blue-400 hover:text-blue-300 underline mt-1"
                >
                  Rate again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-bold mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><a href="/boarding" className="hover:underline">Boardings</a></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-black-500" />
            info@sbf.lk
          </p>
          <p className="flex items-center gap-2 mt-2">
            <FaPhoneAlt className="text-black-500" />
            +94 712432145
          </p>
        </div>

      </div>

       {/* Copyright Section */}
      <div className="text-center text-sm mt-6 border-t border-gray-500 pt-4">
        © 2025 Smart Boarding Finder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;