import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import Navbar from './Navbar';
import bgHero from '../assets/image.png';

const OwnerDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    contact: '',
  });

  const [errors, setErrors] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginNIC, setLoginNIC] = useState('');
  const [loginError, setLoginError] = useState('');

  // OTP related states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNIC = (nic) => {
    const cleanNIC = nic.replace(/\s+/g, '').toUpperCase();
    const newNICRegex = /^\d{12}$/;
    const oldNICRegex = /^\d{9}[VX]$/;
    return newNICRegex.test(cleanNIC) || oldNICRegex.test(cleanNIC);
  };

  const validateContact = (contact) => {
    const cleanContact = contact.replace(/[\s\-\+]/g, '');
    const contactRegex = /^\d{10}$/;
    return contactRegex.test(cleanContact);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!validateNIC(formData.nic)) {
      newErrors.nic = 'NIC must be either 12 digits or 9 digits followed by V/X';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!validateContact(formData.contact)) {
      newErrors.contact = 'Contact number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginNIC = () => {
    if (!loginNIC.trim()) {
      setLoginError('NIC is required');
      return false;
    }
    if (!validateNIC(loginNIC)) {
      setLoginError('Please enter a valid NIC (12 digits or 9 digits + V/X)');
      return false;
    }
    setLoginError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // If email is changed and was previously verified, reset verification
    if (name === 'email' && isEmailVerified && value.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setIsEmailVerified(false);
      setVerifiedEmail('');
    }
  };

  // Send OTP to email
  const sendOTP = async () => {
    if (!formData.email.trim()) {
      setErrors({ ...errors, email: 'Please enter your email first' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setOtpError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      setShowOTPModal(true);
      
      // Start resend timer (60 seconds)
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      alert('📧 OTP sent to your email!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setOtpError('Server error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otp.trim().length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email.trim().toLowerCase(), 
          otp: otp.trim() 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setOtpError(data.error || 'Invalid OTP');
        return;
      }

      // Email verified successfully
      setIsEmailVerified(true);
      setVerifiedEmail(formData.email.trim().toLowerCase());
      setShowOTPModal(false);
      setOtp('');
      setOtpSent(false);
      alert('✅ Email verified successfully!');
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setOtpError('Server error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (resendTimer > 0) return;
    await sendOTP();
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if email is verified
    if (!isEmailVerified || verifiedEmail.toLowerCase() !== formData.email.trim().toLowerCase()) {
      alert('❌ Please verify your email first');
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        nic: formData.nic.replace(/\s+/g, '').toUpperCase(),
        contact: formData.contact.replace(/[\s\-\+]/g, '')
      };

      const res = await fetch('http://localhost:5000/api/owner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      alert('✅ Registered successfully');
     
      console.log('Server response:', data);
      navigate('/register/house', { 
        state: { 
          ownerData: cleanedData,
          owner_id: data.owner_id || data.id || data.ownerId
        } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      alert('❌ Server error. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!validateLoginNIC()) {
      return;
    }

    try {
      const cleanedNIC = loginNIC.replace(/\s+/g, '').toUpperCase();
      
      const res = await fetch('http://localhost:5000/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nic: cleanedNIC }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      alert('✅ Login successful');
      setShowLoginModal(false);
      setLoginError('');

      console.log('Login response:', data);

      navigate('/register/house', { 
        state: { 
          ownerData: data.owner || data,
          owner_id: data.owner?.id || data.id || data.owner_id
        } 
      });
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('❌ Server error. Please try again.');
    }
  };

  const handleLoginNICChange = (e) => {
    setLoginNIC(e.target.value);
    if (loginError) {
      setLoginError('');
    }
  };

  const closeOTPModal = () => {
    setShowOTPModal(false);
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setResendTimer(0);
  };

  return (
    <>
      <Navbar />

      <div
        className="relative flex-grow px-8 pt-32 pb-16"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pt-32 pb-20 px-6 bg-white/50 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-black">
              <FaUser /> Owner Details
            </h2>
            <div className="h-1 w-20 bg-green-600 mt-1 mb-4 rounded-full" />
            <div className="space-y-4">
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded text-black placeholder-gray-500 ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border px-4 py-2 rounded text-black placeholder-gray-500 ${
                      errors.email ? 'border-red-500 bg-red-50' : 
                      isEmailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                  />
                  {isEmailVerified && verifiedEmail.toLowerCase() === formData.email.trim().toLowerCase() && (
                    <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
                  )}
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                {isEmailVerified && verifiedEmail.toLowerCase() === formData.email.trim().toLowerCase() ? (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <FaCheckCircle size={12} /> Email verified
                  </p>
                ) : (
                  <button
                    onClick={sendOTP}
                    disabled={otpLoading || !formData.email.trim()}
                    className={`mt-2 px-4 py-1 rounded text-sm font-medium transition-colors ${
                      otpLoading || !formData.email.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {otpLoading ? 'Sending...' : 'Verify Email'}
                  </button>
                )}
              </div>

              <div>
                <input
                  name="nic"
                  type="text"
                  placeholder="NIC (12 digits or 9 digits + V/X)"
                  value={formData.nic}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded text-black placeholder-gray-500 ${
                    errors.nic ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
                <p className="text-xs text-gray-600 mt-1">
                  Example: 200012345678 or 901234567V
                </p>
              </div>

              <div>
                <input
                  name="contact"
                  type="tel"
                  placeholder="Contact Number (10 digits)"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full border px-4 py-2 rounded text-black placeholder-gray-500 ${
                    errors.contact ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                <p className="text-xs text-gray-600 mt-1">
                  Example: 0771234567
                </p>
              </div>

              <button
                onClick={handleRegister}
                disabled={!isEmailVerified}
                className={`px-8 py-3 rounded font-bold mt-6 transition-colors ${
                  !isEmailVerified
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {!isEmailVerified ? 'Verify Email to Register' : 'Register'}
              </button>

              <p className="mt-4 text-sm text-black">
                Already registered?{' '}
                <span
                  onClick={() => setShowLoginModal(true)}
                  className="text-blue-700 hover:underline cursor-pointer font-semibold"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl w-96 text-center">
            <div className="flex items-center justify-center mb-4">
              <FaEnvelope className="text-blue-500 text-2xl mr-2" />
              <h2 className="text-xl font-bold text-black">Verify Email</h2>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              We sent a 6-digit code to<br />
              <span className="font-medium">{formData.email}</span>
            </p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (otpError) setOtpError('');
                }}
                className={`w-full border px-4 py-3 rounded text-center text-lg font-mono tracking-widest text-black placeholder-gray-500 ${
                  otpError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                maxLength="6"
              />
              {otpError && <p className="text-red-500 text-sm mt-1 text-left">{otpError}</p>}
            </div>

            <button
              onClick={verifyOTP}
              disabled={otpLoading || otp.length !== 6}
              className={`w-full py-2 rounded mb-3 font-medium transition-colors ${
                otpLoading || otp.length !== 6
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-sm text-gray-600">
              {resendTimer > 0 ? (
                <p>Resend OTP in {resendTimer}s</p>
              ) : (
                <button
                  onClick={resendOTP}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <p
              onClick={closeOTPModal}
              className="mt-4 text-sm text-gray-600 hover:underline cursor-pointer"
            >
              Cancel
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl w-96 text-center">
            <h2 className="text-xl font-bold mb-4 text-black">Login with NIC</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter NIC"
                value={loginNIC}
                onChange={handleLoginNICChange}
                className={`w-full border px-4 py-2 rounded text-black placeholder-gray-500 ${
                  loginError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {loginError && <p className="text-red-500 text-sm mt-1 text-left">{loginError}</p>}
            </div>
            <button
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mb-3 transition-colors"
            >
              Login
            </button>
            <p
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
                setLoginNIC('');
              }}
              className="text-sm text-gray-600 hover:underline cursor-pointer"
            >
              Cancel
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerDetails;