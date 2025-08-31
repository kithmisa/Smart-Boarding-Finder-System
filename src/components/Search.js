import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './styles.css';
import bgHero from '../assets/image.png';

function Search() {
  const navigate = useNavigate();
  
  // State for form inputs
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    genderAllowed: '',
    roomType: '',
    priceRange: ''
  });
  
  const features = [
    { icon: "🏠", title: "Verified Properties", desc: "All boarding places are verified and inspected to ensure quality and safety for students." },
    { icon: "💰", title: "Best Prices", desc: "Find affordable boarding options that fit your budget without compromising on quality." },
    { icon: "📍", title: "Prime Locations", desc: "Properties located near University of Ruhuna with easy access to campus and amenities." },
    { icon: "📞", title: "24/7 Support", desc: "Our support team is always available to help you with any queries or concerns." },
    { icon: "⚡", title: "Quick Booking", desc: "Fast and easy booking process to secure your accommodation in minutes." },
    { icon: "🛡️", title: "Safe & Secure", desc: "All properties meet safety standards with secure payment methods and legal agreements." }
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create query string from filters
    const queryParams = new URLSearchParams();
    
    Object.keys(searchFilters).forEach(key => {
      if (searchFilters[key] && searchFilters[key] !== '') {
        queryParams.append(key, searchFilters[key]);
      }
    });
    
    // Navigate to boarding list with search parameters
    const searchQuery = queryParams.toString();
    navigate(`/boarding${searchQuery ? '?' + searchQuery : ''}`);
  };

  return (
    <div className="app-container">
      <main>
        <section 
          className="search-section"
          style={{
            backgroundImage: `url(${bgHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Semi-transparent overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}></div>
          
          {/* Content container */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <h1 style={{ color: 'white', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
              Where to stay near University of Ruhuna?
            </h1>
            <form className="search-form" onSubmit={handleSearch}>
            <select 
              name="location" 
              value={searchFilters.location}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Location</option>
              <option value="Matara Town">Matara</option>
              <option value="Pallimulla">Pallimulla</option>
              <option value="Welewaththa">Welewaththa</option>
              <option value="Maddewaththa">Maddewaththa</option>
              <option value="Eliyakanda">Eliyakanda</option>
              <option value="Janaraja Mw">Janaraja Mw</option>
              <option value="Rassandeniya">Rassandeniya</option>
              <option value="Gandarawaththa">Gandarawaththa</option>
              <option value="S K Town">S K Town</option>
              <option value="Devinuwara">Devinuwara</option>
            </select>

            <select 
              name="genderAllowed" 
              value={searchFilters.genderAllowed}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Gender Allowed</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Anyone">Anyone</option>
            </select>

            <select 
              name="roomType" 
              value={searchFilters.roomType}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Room Type</option>
              <option value="private">Private Room</option>
              <option value="shared">Shared Room</option>
              <option value="Dormitory">Dormitory</option>
              <option value="Apartment">Apartment</option>
            </select>

            <select 
              name="priceRange" 
              value={searchFilters.priceRange}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Price Range</option>
              <option value="0-5000">Below 5000 LKR</option>
              <option value="5000-10000">5000–10000 LKR</option>
              <option value="10000-15000">10000–15000 LKR</option>
              <option value="15000+">Over 15,000 LKR</option>
            </select>

            <button type="submit">Search Now</button>
          </form>
          </div>
        </section>
      </main>

      <section className="features-section">
        <h2>Why Choose Smart Boarding Finder?</h2>
        <div className="features-list">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Search;