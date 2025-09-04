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
  
  // ✅ NIC validation display states
  const [nicInfo, setNicInfo] = useState(null);
  const [showNicInfo, setShowNicInfo] = useState(false);
  
  // ✅ Terms and conditions state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // ✅ Enhanced NIC Validation with DOB & Gender Detection
  const parseNIC = (nic) => {
    const cleanNIC = nic.replace(/\s+/g, '').toUpperCase();
    let year, dayText;

    if (/^[0-9]{9}[VX]$/.test(cleanNIC)) {
      // Old NIC (before 2016) → XXXXXXXXXV
      year = parseInt("19" + cleanNIC.substring(0, 2)); 
      dayText = cleanNIC.substring(2, 5);
    } else if (/^[0-9]{12}$/.test(cleanNIC)) {
      // New NIC (after 2016) → YYYYDDDDDDDD
      year = parseInt(cleanNIC.substring(0, 4));
      dayText = cleanNIC.substring(4, 7);
    } else {
      return { valid: false, message: "Invalid NIC format" };
    }

    let dayOfYear = parseInt(dayText);
    let gender = "Male";

    if (dayOfYear > 500) {
      gender = "Female";
      dayOfYear -= 500;
    }

    // Validate day of year range (1-366)
    if (dayOfYear < 1 || dayOfYear > 366) {
      return { valid: false, message: "Invalid day number in NIC" };
    }

    // Validate year range (1900 to current year)
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return { valid: false, message: "Invalid year in NIC" };
    }

    // Convert day of year → actual date
    const dob = new Date(year, 0); // January 1st
    dob.setDate(dayOfYear);

    // Check if date is valid (handles leap years, etc.)
    if (dob.getFullYear() !== year) {
      return { valid: false, message: "Invalid date in NIC" };
    }

    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Check minimum age requirement (18 years)
    if (age < 18) {
      return { 
        valid: false, 
        message: `Age must be at least 18 years. Current age: ${age} years` 
      };
    }

    return {
      valid: true,
      yearOfBirth: year,
      dateOfBirth: dob.toISOString().split("T")[0], // YYYY-MM-DD
      gender: gender,
      age: age,
      dayOfYear: dayOfYear,
      nicType: cleanNIC.length === 12 ? 'New' : 'Old'
    };
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNIC = (nic) => {
    const nicValidation = parseNIC(nic);
    return nicValidation.valid;
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
    } else {
      const nicValidation = parseNIC(formData.nic);
      if (!nicValidation.valid) {
        newErrors.nic = nicValidation.message;
      }
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!validateContact(formData.contact)) {
      newErrors.contact = 'Contact number must be exactly 10 digits';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions to register';
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
      setLoginError('Please enter a valid NIC format');
    } else {
      const nicValidation = parseNIC(loginNIC);
      if (!nicValidation.valid) {
        setLoginError(nicValidation.message);
        return false;
      }
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

    // Clear NIC info when there's an error
    if (errors.nic && name === 'nic') {
      setNicInfo(null);
      setShowNicInfo(false);
    }

    // If email is changed and was previously verified, reset verification
    if (name === 'email' && isEmailVerified && value.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setIsEmailVerified(false);
      setVerifiedEmail('');
    }

    // ✅ Real-time NIC validation and info display
    if (name === 'nic') {
      if (value.trim()) {
        const validation = parseNIC(value);
        if (validation.valid) {
          setNicInfo(validation);
          setShowNicInfo(true);
        } else {
          setNicInfo(null);
          setShowNicInfo(false);
        }
      } else {
        setNicInfo(null);
        setShowNicInfo(false);
      }
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
     
      // Clear form and NIC info
      setFormData({
        name: '',
        email: '',
        nic: '',
        contact: '',
      });
      setNicInfo(null);
      setShowNicInfo(false);
      setErrors({});
      setIsEmailVerified(false);
      setVerifiedEmail('');
     
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
                    errors.nic ? 'border-red-500 bg-red-50' : 
                    nicInfo ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                />
                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
                
                {/* ✅ Enhanced NIC Information Display */}
                {showNicInfo && nicInfo && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-800">Valid NIC ✓</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                      <div>
                        <span className="font-medium">Date of Birth:</span>
                        <br />
                        <span className="font-semibold">{nicInfo.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span>
                        <br />
                        <span className="font-semibold">{nicInfo.gender}</span>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <br />
                        <span className="font-semibold">{nicInfo.age} years</span>
                      </div>
                      <div>
                        <span className="font-medium">NIC Type:</span>
                        <br />
                        <span className="font-semibold">{nicInfo.nicType}</span>
                      </div>
                    </div>
                  </div>
                )}
                
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

               {/* ✅ Terms and Conditions */}
               <div className="mt-4">
                 <div className="flex items-start gap-3">
                   <input
                     type="checkbox"
                     id="acceptTerms"
                     checked={acceptedTerms}
                     onChange={(e) => setAcceptedTerms(e.target.checked)}
                     className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                   />
                   <div className="text-sm text-gray-700">
                     <label htmlFor="acceptTerms" className="cursor-pointer">
                       I agree to the{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                         className="text-blue-600 hover:text-blue-800 underline font-medium"
                       >
                         Terms and Conditions
                       </button>
                       {' '}and{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                         className="text-blue-600 hover:text-blue-800 underline font-medium"
                       >
                         Privacy Policy
                       </button>
                     </label>
                     {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                   </div>
                 </div>
               </div>

               <button
                 onClick={handleRegister}
                 disabled={!isEmailVerified || !acceptedTerms}
                 className={`px-8 py-3 rounded font-bold mt-6 transition-colors ${
                   !isEmailVerified || !acceptedTerms
                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                     : 'bg-blue-600 hover:bg-blue-700 text-white'
                 }`}
               >
                 {!isEmailVerified ? 'Verify Email to Register' : 
                  !acceptedTerms ? 'Accept Terms to Register' : 'Register'}
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]">
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100]">
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

       {/* ✅ Terms and Conditions Modal */}
       {showTermsModal && (
         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100] p-4">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[70vh] overflow-y-auto">
             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold text-gray-800">Terms and Conditions & Privacy Policy</h2>
                 <button
                   onClick={() => setShowTermsModal(false)}
                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                 >
                   ×
                 </button>
               </div>
             </div>
             
             <div className="p-6 space-y-6">
               {/* Terms and Conditions */}
               <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Terms and Conditions</h3>
                 <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
                   <p><strong>1. Acceptance of Terms</strong></p>
                   <p>By registering with Smart Boarding Finder System, you agree to be bound by these terms and conditions.</p>
                   
                   <p><strong>2. User Responsibilities</strong></p>
                   <p>• You must provide accurate and truthful information during registration</p>
                   <p>• You are responsible for maintaining the confidentiality of your account</p>
                   <p>• You must be at least 18 years old to register</p>
                   <p>• You agree not to use the service for any illegal or unauthorized purpose</p>
                   
                   <p><strong>3. Property Listings</strong></p>
                   <p>• All property information must be accurate and up-to-date</p>
                   <p>• You are responsible for the accuracy of property details, images, and availability</p>
                   <p>• Property listings are subject to admin approval before going live</p>
                   
                   <p><strong>4. Payment and Fees</strong></p>
                   <p>• Bank details are required for receiving booking payments</p>
                   <p>• All transactions are processed securely through the platform</p>
                   
                   <p><strong>5. Prohibited Activities</strong></p>
                   <p>• Posting false or misleading information</p>
                   <p>• Harassing or discriminating against potential tenants</p>
                   <p>• Violating any applicable laws or regulations</p>
                   
                   <p><strong>6. Termination</strong></p>
                   <p>• We reserve the right to suspend or terminate accounts that violate these terms</p>
                   <p>• You may terminate your account at any time</p>
                 </div>
               </div>

               {/* Privacy Policy */}
               <div className="border-t border-gray-200 pt-6">
                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Policy</h3>
                 <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
                   <p><strong>1. Information We Collect</strong></p>
                   <p>• Personal information (name, email, contact number, NIC)</p>
                   <p>• Property details and images</p>
                   <p>• Bank account information for payment processing</p>
                   <p>• Communication records and booking history</p>
                   
                   <p><strong>2. How We Use Your Information</strong></p>
                   <p>• To provide and maintain our services</p>
                   <p>• To process payments and bookings</p>
                   <p>• To communicate with you about your account and services</p>
                   <p>• To improve our platform and user experience</p>
                   
                   <p><strong>3. Information Security</strong></p>
                   <p>• We implement appropriate security measures to protect your data</p>
                   <p>• Bank details are encrypted and stored securely</p>
                   <p>• Access to personal information is restricted to authorized personnel</p>
                   
                   <p><strong>4. Information Sharing</strong></p>
                   <p>• We do not sell, trade, or rent your personal information</p>
                   <p>• Information may be shared with tenants for booking purposes</p>
                   <p>• We may disclose information if required by law</p>
                   
                   <p><strong>5. Data Retention</strong></p>
                   <p>• We retain your information as long as your account is active</p>
                   <p>• You may request deletion of your data at any time</p>
                   
                   <p><strong>6. Contact Information</strong></p>
                   <p>For questions about these terms or privacy policy, contact our support team.</p>
                 </div>
               </div>

               {/* Acceptance Button */}
               <div className="border-t border-gray-200 pt-6">
                 <div className="flex justify-between items-center">
                   <button
                     onClick={() => setShowTermsModal(false)}
                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                   >
                     Close
                   </button>
                   <button
                     onClick={() => {
                       setAcceptedTerms(true);
                       setShowTermsModal(false);
                     }}
                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     Accept Terms
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </>
   );
 };

export default OwnerDetails;