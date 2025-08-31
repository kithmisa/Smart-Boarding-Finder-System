import React, { useState } from 'react';
import './FloatingAdminIcon.css';
import AdminLoginModal from './AdminLoginModal';
import { useNavigate } from 'react-router-dom';

const FloatingAdminIcon = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/admin-dashboard');
  };

  return (
    <>
      <div className="floating-admin-icon" onClick={() => setShowLogin(true)}>
        🔑 {/* You can replace with an icon */}
      </div>
      {showLogin && (
        <AdminLoginModal onClose={() => setShowLogin(false)} onLogin={handleLoginSuccess} />
      )}
    </>
  );
};

export default FloatingAdminIcon;
