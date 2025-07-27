import React, { useState } from 'react';
import './adminRegister.css';

function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agree) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    console.log("Admin Registered:", formData);
    setSuccess(true);
  };

  return (
    <div className="register-container">
      <h2>Register as Admin</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label className="terms-label">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
          />
          I agree to the <span onClick={() => setShowModal(true)} style={{ color: '#007BFF', cursor: 'pointer' }}>Terms and Conditions</span>
        </label>

        <button type="submit">Register</button>

        {success && (
          <p className="success-message">
            Registration successful! Please check your email to verify your account.
          </p>
        )}
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>
              Terms and Conditions
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              By registering on <strong>Smart Boarding Finder</strong>, you agree to the following terms:
            </p>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
              <li>You must provide accurate and truthful information.</li>
              <li>Do not impersonate other admins or users.</li>
              <li>We will email you for verification and admin updates.</li>
              <li>Keep your credentials secure.</li>
              <li>We reserve the right to suspend accounts violating policies.</li>
            </ul>
            <button onClick={() => setShowModal(false)} className="close-modal">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRegisterForm;
