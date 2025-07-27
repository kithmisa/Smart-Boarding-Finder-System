import React from 'react';
import './welcomepage.css';

const WelcomePage = () => {
  // Optionally, retrieve owner name from context or localStorage
  const ownerName = localStorage.getItem('ownerName') || "Boarding Owner";

  return (
    <div className="welcome-container">
      <h2>Welcome, {ownerName} 👋</h2>
      <p>Thank you for using our Boarding Advertisement System!</p>
      <p>Use the sidebar to manage your listings, update your profile, and more.</p>
    </div>
  );
};

export default WelcomePage;