import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginModal.css'; // Style input + modal

const AdminLoginModal = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Login button clicked"); // ✅ Confirm it's triggered
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
       console.log("Server response:", data); // ✅ log this


      if (res.ok && data.success) {
        console.log('Login successful');
        onClose(); // Close modal
        navigate('/admin-dashboard'); // Navigate
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="admin-login-modal">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <div className="button-group">
            <button type="submit">Login</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;

