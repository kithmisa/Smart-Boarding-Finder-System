import React, { useState } from 'react';
import './PaymentForm.css';

function PaymentForm() {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setShowOTP(true); // Show OTP input
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setSubmitted(true);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Gateway</h2>

      {!showOTP && !submitted && (
        <form onSubmit={handlePaymentSubmit} className="payment-form">
          <label>Name on Card</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Card Number</label>
          <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required />

          <label>Expiry Date</label>
          <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} required />

          <label>CVV</label>
          <input type="password" name="cvv" value={formData.cvv} onChange={handleChange} required />

          <button type="submit">Pay Now</button>
        </form>
      )}

      {showOTP && !submitted && (
        <form onSubmit={handleOtpSubmit} className="otp-form">
          <label>Enter OTP sent to your phone</label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {submitted && (
        <p className="success-message">✅ Payment Verified Successfully!</p>
      )}
    </div>
  );
}

export default PaymentForm;
