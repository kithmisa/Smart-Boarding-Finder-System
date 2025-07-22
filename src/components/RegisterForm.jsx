import React, { useState } from 'react';
import './register.css'; // Your custom CSS

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ State for success message
  const [showModal, setShowModal] = useState(false); // ✅ State for Terms popup modal

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.agree) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    // ✅ Show success message
    console.log("Submitted data:", formData);
    setSuccess(true);
  };

  return (
    <div className="register-container">
      <h2>Register as a User</h2>

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

        {/* ✅ Terms and conditions label with modal link */}
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

        {/* ✅ Show success message below button */}
        {success && (
          <p className="success-message">
            Registration successful! Please check your email to verify your account.
          </p>
        )}
      </form>

      {/* ✅ Terms and Conditions Popup Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>
   Terms and Conditions</h3>
            <p style={{ marginBottom: '1rem' }}>
        By registering on <strong>Smart Boarding Finder</strong>, you agree to the following terms:
      </p>

      <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
        <li>You will provide accurate and truthful information when registering.</li>
        <li>You will not misuse or impersonate another individual.</li>
        <li>We may send you emails related to account verification or service updates.</li>
        <li>Your information will be handled securely, but you are responsible for keeping your password safe.</li>
        <li>Smart Boarding Finder reserves the right to suspend accounts that violate our policies.</li>
      </ul>
            <button onClick={() => setShowModal(false)} className="close-modal">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;



