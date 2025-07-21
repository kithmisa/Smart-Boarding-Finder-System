import React from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import image from '../assets/image.png';
import './styles.css';

  
function Search() {
  const features = [
    { icon: "🏠", title: "Verified Properties", desc: "All boarding places are verified and inspected to ensure quality and safety for students." },
    { icon: "💰", title: "Best Prices", desc: "Find affordable boarding options that fit your budget without compromising on quality." },
    { icon: "📍", title: "Prime Locations", desc: "Properties located near University of Ruhuna with easy access to campus and amenities." },
    { icon: "📞", title: "24/7 Support", desc: "Our support team is always available to help you with any queries or concerns." },
    { icon: "⚡", title: "Quick Booking", desc: "Fast and easy booking process to secure your accommodation in minutes." },
    { icon: "🛡️", title: "Safe & Secure", desc: "All properties meet safety standards with secure payment methods and legal agreements." }
  ];
  return (
    <div className="app-container">

      <main>
        <section className="search-section">
          <h1>Where to stay near University of Ruhuna?</h1>
          <form className="search-form" >
            <select name="location" defaultValue="" aria-label="Select location">
              <option value="">Select Location</option>
              <option value="Matara Town">Matara</option>
              <option value="Pallimulla">Pallimulla</option>
              <option value="Welewaththa">Welewaththa</option>
              <option value="Maddewaththa">Maddewaththa</option>
              <option value="Eliyakanda">Eliyakanda</option>
              <option value="Janaraja Mw">Janaraja Mw</option>
              <option value="Rassandeniya">Rassandeniya</option>
              <option value="Gandarawaththa">Gandarawaththa</option>
              <option value="S K Town">S K Town</option>
              <option value="Dewundara">Dewundara</option>
            </select>

            <select name="borderType" defaultValue="" aria-label="Select Type">
              <option value="">Select Border Type</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select name="amountType" defaultValue="" aria-label="Select Type">
              <option value="">Select Amount Type</option>
              <option value="One Person">One Person</option>
              <option value="Two Persons">Two Persons</option>
              <option value="2-8 Persons">2-8 Persons</option>
              <option value="more than 8 Persons">More than 8 Persons</option>
            </select>

            <select name="priceRange" defaultValue="" aria-label="Selec Price Range">
              <option value="">Select Price Range</option>
              <option value="less-than-5000">Below 5000 LKR</option>
              <option value="5000-7000">5000–7000 LKR</option>
              <option value="more-than-10000">Over 10,000 LKR</option>
            </select>

            <button type="submit">Search Now</button>
          </form>
        </section>
      </main>
      {/* Features Section */}
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

export default Search ;