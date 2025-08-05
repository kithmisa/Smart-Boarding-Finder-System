import React, { useState } from 'react';
import { Home, Users, FileText, Settings, LogOut, Search } from 'lucide-react';
import './dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const sidebarItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Boarding Places', icon: Home },
    { name: 'Users', icon: Users },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings }
  ];

  const statsCards = [
    { title: '20', subtitle: 'Users', color: 'teal' },
    { title: '30 Total', subtitle: 'Boardings', color: 'teal-dark' },
    { title: '3', subtitle: 'Reports', color: 'purple' },
    { title: '5', subtitle: 'New Users', color: 'green' },
    { title: '6', subtitle: 'Admin Users', color: 'blue' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <div className="admin-profile">
              <div className="profile-label">Admin Profile:</div>
              <div className="profile-email">admin@gmail.com</div>
            </div>
            
            <nav className="sidebar-nav">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="logout-section">
              <button
                onClick={() => setActiveTab('Logout')}
                className="nav-item logout-btn"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">Welcome to Smart Boarding System</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsCards.map((card, index) => (
              <div key={index} className={`stat-card ${card.color}`}>
                <div className="stat-number">{card.title}</div>
                <div className="stat-label">{card.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="content-area">
            <div className="content-background"></div>
            <div className="content-overlay">
              <div className="search-section">
                <h3 className="search-title">Searching Boarding Places</h3>
                <p className="search-description">Find the perfect boarding place for your needs</p>
                <div className="search-container">
                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Search boarding places..."
                      className="search-input"
                    />
                    <button className="search-button">
                      <Search size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;