
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserLock } from 'react-icons/fa'; // Lock person icon
import { User, ChevronDown, LogOut, Settings } from 'lucide-react'; // Person icon

const Navbar = ({ onAuthClick, isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <nav
      className={`flex justify-between items-center text-black font-bold px-2 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#5F5F5F] shadow-md' : 'bg-black bg-opacity-10'
      }`}
      style={{
        backgroundColor: scrolled ? '#5F5F5F' : 'rgba(0, 0, 0, 0.1)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none'
      }}
    >
      <div className="text-lg font-semibold flex items-center gap-4">
       <img src="/logo1.png" alt="logo" className="w-24 h-24"/> 
      </div>
      <div className="flex gap-14 ml-80">
        <Link to="/" className="hover:underline transition-colors duration-200" style={{ color: scrolled ? '#CECECD' : '#000' }}>Home</Link>
        <Link to="/boarding" className="hover:underline transition-colors duration-200" style={{ color: scrolled ? '#CECECD' : '#000' }}>Boardings</Link>
        <a href="/contact" className="hover:underline transition-colors duration-200" style={{ color: scrolled ? '#CECECD' : '#000' }}>Contact</a>
        <Link to="/about" className="hover:underline transition-colors duration-200" style={{ color: scrolled ? '#CECECD' : '#000' }}>About</Link>
      </div>
      
      {/* Auth and Register buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          /* User Profile Dropdown */
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-opacity-20"
              style={{ 
                backgroundColor: scrolled ? 'rgba(24, 23, 23, 0.93)' : 'rgba(26, 25, 24, 0.13)',
                color: scrolled ? '#CECECD' : '#CECECD'
              }}
              title="My Profile"
            >
              <User size={20} />
              <span className="hidden sm:inline text-sm font-medium">
                {user?.firstName || 'User'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    // Navigate to profile route with user ID
                    const userId = localStorage.getItem('user_id');
                    if (userId) {
                      navigate(`/profile/${userId}`);
                    } else {
                      // If no user_id, redirect to login
                      onAuthClick();
                    }
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>
                <button
                     onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Login Button */
          <button 
            onClick={onAuthClick}
            className="flex items-center gap-2 p-2 rounded-full transition-all duration-200 hover:scale-105 hover:bg-opacity-20"
            style={{ 
              backgroundColor: scrolled ? 'rgba(34, 33, 33, 0.44)' : 'rgba(224, 203, 203, 0.57)',
              color: scrolled ? '#CECECD' : '#8B4513'
            }}
            title="Sign In / Sign Up"
          >
            <User size={20} />
            <span className="hidden sm:inline text-sm  font-medium bold">Login</span>
          </button>
        )}
        
        {/* Register button - only show when not authenticated */}
        {!isAuthenticated && (
          <Link to="/register">
            <button 
             className="bg-transparent text-black px-6 py-2.5 rounded-normal font-bold text-xl hover:bg-gray-100 border-2 border-black transition-colors duration-200"
            
            >
              Register
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
