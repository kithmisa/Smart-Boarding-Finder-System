import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelect }) => (
  <div className="sidebar">
    <h2>SmartBoard</h2>
    <ul>
      <li onClick={() => onSelect('add')}>➕ Add New Boarding</li>
      <li onClick={() => onSelect('list')}>📋 View My Listings</li>
      <li onClick={() => onSelect('profile')}>👤 Edit Profile</li>
      <li onClick={() => onSelect('logout')}>🚪 Logout</li>
    </ul>
    <footer>
      <p>Navigation</p>
      <p>Contact: 0712345678</p>
      <div className="icons">
        <i className="fa fa-facebook" />
        <i className="fa fa-instagram" />
        <i className="fa fa-twitter" />
      </div>
    </footer>
  </div>
);

export default Sidebar;