import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaWhatsapp , FaStar } from 'react-icons/fa';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';


const Footer = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating) {
      setSubmitted(true);
      console.log(`Rated: ${rating}`);
    }
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
            <FaFacebook />
          </div>

          {/* Rating Block (on left) */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Rate Our Website</h3>
            <div className="flex gap-2 text-2xl">
              {[...Array(5)].map((_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(null)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      color={value <= (hover || rating) ? '#facc15' : '#d1d5db'}
                    />
                  </button>
                );
              })}
            </div>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
              >
                Submit
              </button>
            ) : (
              <p className="text-green-400 mt-2 text-sm">Thanks for your feedback!</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-bold mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><a href="#" className="hover:underline">Boardings</a></li>
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
            <FaPhoneAlt className="text-500" />
            +94 71 2 432 145
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
