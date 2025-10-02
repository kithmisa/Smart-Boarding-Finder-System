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
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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
  
  // NIC validation display states
  const [nicInfo, setNicInfo] = useState(null);
  const [showNicInfo, setShowNicInfo] = useState(false);
  
  // Terms and conditions state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false);
  const [forgotPasswordResendTimer, setForgotPasswordResendTimer] = useState(0);
  const [generatedOTP, setGeneratedOTP] = useState('');

  // Enhanced NIC Validation with DOB & Gender Detection
  const parseNIC = (nic) => {
    const cleanNIC = nic.replace(/\s+/g, '').toUpperCase();
    let year, dayText;

    if (/^[0-9]{9}[VX]$/.test(cleanNIC)) {
      year = parseInt("19" + cleanNIC.substring(0, 2)); 
      dayText = cleanNIC.substring(2, 5);
    } else if (/^[0-9]{12}$/.test(cleanNIC)) {
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

    if (dayOfYear < 1 || dayOfYear > 366) {
      return { valid: false, message: "Invalid day number in NIC" };
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return { valid: false, message: "Invalid year in NIC" };
    }

   const dob = new Date(year, 0);
   dob.setDate(dayOfYear);
    
  if (dob.getFullYear() !== year) {
      return { valid: false, message: "Invalid date in NIC" };
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return { 
        valid: false, 
        message: `Age must be at least 18 years. Current age: ${age} years` 
      };
    }

    return {
      valid: true,
      yearOfBirth: year,
      //dateOfBirth: dob.toISOString().split("T")[0],
       dateOfBirth: dob.toLocaleDateString('en-CA'),
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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  // Step validation functions
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    return validateStep1() && validateStep2() && validateStep3();
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateLoginCredentials = () => {
    if (!loginName.trim()) {
      setLoginError('Name is required');
      return false;
    }
    if (!loginPassword.trim()) {
      setLoginError('Password is required');
        return false;
    }
    setLoginError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (errors.nic && name === 'nic') {
      setNicInfo(null);
      setShowNicInfo(false);
    }

    if (name === 'email' && isEmailVerified && value.trim().toLowerCase() !== verifiedEmail.toLowerCase()) {
      setIsEmailVerified(false);
      setVerifiedEmail('');
    }

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
        contact: formData.contact.replace(/[\s\-\+]/g, ''),
        password: formData.password
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
     
      setFormData({
        name: '',
        email: '',
        nic: '',
        contact: '',
        password: '',
        confirmPassword: '',
      });
      setNicInfo(null);
      setShowNicInfo(false);
      setErrors({});
      setIsEmailVerified(false);
      setVerifiedEmail('');
     
      console.log('Server response:', data);
      try {
        const newOwnerId = data.owner_id || data.id || data.ownerId;
        if (newOwnerId) {
          localStorage.setItem('owner_id', String(newOwnerId));
        }
        const enrichedOwnerInfo = { ...cleanedData, id: newOwnerId, owner_id: newOwnerId };
        localStorage.setItem('owner_info', JSON.stringify(enrichedOwnerInfo));
      } catch {}
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
    if (!validateLoginCredentials()) {
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: loginName.trim(),
          password: loginPassword
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }

      alert('✅ Login successful');
      setShowLoginModal(false);
      setLoginError('');
      setLoginName('');
      setLoginPassword('');

      console.log('Login response:', data);
      try {
        const existingOwnerId = data.owner?.id || data.id || data.owner_id;
        if (existingOwnerId) {
          localStorage.setItem('owner_id', String(existingOwnerId));
        }
        localStorage.setItem('owner_info', JSON.stringify(data.owner || data));
      } catch {}

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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    if (name === 'loginName') {
      setLoginName(value);
    } else if (name === 'loginPassword') {
      setLoginPassword(value);
    }
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

  // Generate OTP function
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Forgot Password Functions
  const sendForgotPasswordOTP = async () => {
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      // Send OTP to email via API
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotPasswordEmail.trim().toLowerCase(),
          purpose: 'password_reset'
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setForgotPasswordError(data.error || 'Failed to send reset code');
        return;
      }

      setForgotPasswordOtpSent(true);
      setForgotPasswordStep(2);
      
      setForgotPasswordResendTimer(60);
      const timer = setInterval(() => {
        setForgotPasswordResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      alert(`📧 Password reset code sent to ${forgotPasswordEmail}`);
    } catch (err) {
      console.error('Error sending forgot password OTP:', err);
      setForgotPasswordError('Server error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyForgotPasswordOTP = async () => {
    if (!forgotPasswordOtp.trim()) {
      setForgotPasswordError('Please enter the verification code');
      return;
    }

    if (forgotPasswordOtp.trim().length !== 6) {
      setForgotPasswordError('Verification code must be 6 digits');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotPasswordEmail.trim().toLowerCase(), 
          otp: forgotPasswordOtp.trim(),
          purpose: 'password_reset'
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setForgotPasswordError(data.error || 'Invalid verification code');
        return;
      }

      // Store the verified OTP for password reset
      setGeneratedOTP(forgotPasswordOtp.trim());
      setForgotPasswordStep(3);
      setForgotPasswordOtp('');
      alert('✅ Verification successful! Please set your new password.');
    } catch (err) {
      console.error('Error verifying forgot password OTP:', err);
      setForgotPasswordError('Server error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword.trim()) {
      setForgotPasswordError('Please enter a new password');
      return;
    }

    if (!validatePassword(newPassword)) {
      setForgotPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (!confirmNewPassword.trim()) {
      setForgotPasswordError('Please confirm your new password');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const resetData = { 
        email: forgotPasswordEmail.trim().toLowerCase(),
        otp: generatedOTP,
        newPassword: newPassword
      };
      
      console.log('🔐 Sending password reset data:', {
        email: resetData.email,
        otp: resetData.otp,
        passwordLength: resetData.newPassword.length
      });
      
      const res = await fetch('http://localhost:5000/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setForgotPasswordError(data.error || 'Failed to reset password');
        return;
      }

      alert('✅ Password reset successfully! You can now login with your new password.');
      closeForgotPasswordModal();
    } catch (err) {
      console.error('Error resetting password:', err);
      setForgotPasswordError('Server error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resendForgotPasswordOTP = async () => {
    if (forgotPasswordResendTimer > 0) return;
    await sendForgotPasswordOTP();
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail('');
    setForgotPasswordOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotPasswordStep(1);
    setForgotPasswordError('');
    setForgotPasswordOtpSent(false);
    setForgotPasswordResendTimer(0);
    setGeneratedOTP('');
  };

  return (
    <>
      <Navbar />

      <div
        className="relative flex-grow px-4 pt-32 pb-16 min-h-screen"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pt-16 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Left Column - Professional Header */}
              <div className="text-center lg:text-left mt-8 lg:col-span-2">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/50 rounded-full shadow-lg mb-6">
                  <FaUser className="text-3xl text-gray-600 justify-center" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Owner Registration
                </h1>
                <p className="text-white/90 text-xl mb-6 drop-shadow-md">
                  Join our platform and start listing your properties
                </p>
                
                {/* Features List */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Easy property listing management</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Real-time booking notifications</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Form Container */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 lg:col-span-3">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentStep === 1 && 'Personal Information & Identity'}
                      {currentStep === 2 && 'Security Setup'}
                      {currentStep === 3 && 'Email Verification & Terms'}
                    </h2>
                    <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                      Step {currentStep} of {totalSteps}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Step Indicators */}
                  <div className="flex justify-between mt-3">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          step <= currentStep 
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        <span className={`text-xs mt-1 transition-colors ${
                          step <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-500'
                        }`}>
                          {step === 1 && 'Identity'}
                          {step === 2 && 'Security'}
                          {step === 3 && 'Email & Terms'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Personal Information & Identity */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">👤</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Personal Information & Identity</h3>
                      <p className="text-gray-600 text-sm">Let's start with your basic details and identity verification</p>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                <input
                  name="name"
                  type="text"
                        placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name 
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                />
                      {errors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span> {errors.name}
                        </p>
                )}
              </div>

                    {/* NIC Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        National Identity Card (NIC) <span className="text-red-500">*</span>
                      </label>
                <input
                  name="nic"
                  type="text"
                        placeholder="Enter your NIC number"
                  value={formData.nic}
                  onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.nic 
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : nicInfo 
                              ? 'border-green-500 bg-green-50 focus:ring-green-500' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                />
                      {errors.nic && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span> {errors.nic}
                        </p>
                      )}
                      
                      {/* Enhanced NIC Information Display */}
                {showNicInfo && nicInfo && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <FaCheckCircle className="text-green-600" size={18} />
                            <span className="text-sm font-semibold text-green-800">Valid NIC Information</span>
                    </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-green-700">Date of Birth:</span>
                              <div className="font-semibold text-green-800">{nicInfo.dateOfBirth}</div>
                      </div>
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-green-700">Gender:</span>
                              <div className="font-semibold text-green-800">{nicInfo.gender}</div>
                      </div>
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-green-700">Age:</span>
                              <div className="font-semibold text-green-800">{nicInfo.age} years</div>
                      </div>
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-green-700">NIC Type:</span>
                              <div className="font-semibold text-green-800">{nicInfo.nicType}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                      <p className="text-xs text-gray-600 bg-gray-0 px-3 py-2 rounded-lg">
                        <span className="font-medium">Format:</span> 200012345678 (new) or 901234567V (old)
                </p>
              </div>

                    {/* Contact Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                <input
                  name="contact"
                  type="tel"
                        placeholder="Enter your contact number"
                  value={formData.contact}
                  onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.contact 
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                />
                      {errors.contact && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span> {errors.contact}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 bg-gray-0 px-3 py-2 rounded-lg">
                        <span className="font-medium">Format:</span> 0771234567 (10 digits)
                </p>
                             </div>
                  </div>
                )}

                {/* Step 2: Security Setup */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🔒</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Create Your Password</h3>
                      <p className="text-gray-600 text-sm">Choose a strong password to secure your account</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.password 
                                ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <span>⚠️</span> {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.confirmPassword 
                                ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <span>⚠️</span> {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="bg-blue-0 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Password Requirements:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• One uppercase letter (A-Z)</li>
                        <li>• One lowercase letter (a-z)</li>
                        <li>• One number (0-9)</li>
                        <li>• One special character (@$!%*?&)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Email Verification & Terms */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">📧</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Verification & Terms</h3>
                      <p className="text-gray-600 text-sm">Verify your email address and accept our terms to complete registration</p>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email 
                              ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                              : isEmailVerified 
                                ? 'border-green-500 bg-green-50 focus:ring-green-500' 
                                : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                        />
                        {isEmailVerified && verifiedEmail.toLowerCase() === formData.email.trim().toLowerCase() && (
                          <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-lg" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span> {errors.email}
                        </p>
                      )}
                      {isEmailVerified && verifiedEmail.toLowerCase() === formData.email.trim().toLowerCase() ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">
                          <FaCheckCircle size={14} />
                          <span className="font-medium">Email verified successfully</span>
                        </div>
                      ) : (
                        <button
                          onClick={sendOTP}
                          disabled={otpLoading || !formData.email.trim()}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            otpLoading || !formData.email.trim()
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                          }`}
                        >
                          {otpLoading ? 'Sending OTP...' : 'Verify Email'}
                        </button>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-4">
                   <input
                     type="checkbox"
                     id="acceptTerms"
                     checked={acceptedTerms}
                     onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                   />
                   <div className="text-sm text-gray-700">
                     <label htmlFor="acceptTerms" className="cursor-pointer">
                            <span className="font-medium">I agree to the</span>{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                       >
                         Terms and Conditions
                       </button>
                            {' '}<span className="font-medium">and</span>{' '}
                       <button
                         type="button"
                         onClick={() => setShowTermsModal(true)}
                              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                       >
                         Privacy Policy
                       </button>
                     </label>
                          {errors.terms && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.terms}
                            </p>
                          )}
                   </div>
                 </div>
               </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-3">
                    {currentStep < totalSteps ? (
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Next Step →
                      </button>
                    ) : (
               <button
                 onClick={handleRegister}
                 disabled={!isEmailVerified || !acceptedTerms}
                        className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 transform ${
                   !isEmailVerified || !acceptedTerms
                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                 }`}
               >
                        {!isEmailVerified ? 'Verify Email First' : 
                         !acceptedTerms ? 'Accept Terms First' : 'Create Account'}
               </button>
                    )}
                  </div>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                  onClick={() => setShowLoginModal(true)}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Forgot your password?{' '}
                    <button
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
                    >
                      Reset Password
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Verify Email</h2>
                <p className="text-gray-600 text-sm">Enter the code sent to your email</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600 text-sm">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-gray-800 mt-1">{formData.email}</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (otpError) setOtpError('');
                }}
                className={`w-full border-2 px-6 py-4 rounded-xl text-center text-2xl font-mono tracking-widest text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  otpError 
                    ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                    : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
                }`}
                maxLength="6"
              />
              {otpError && (
                <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                  <span>⚠️</span> {otpError}
                </p>
              )}
            </div>

            <button
              onClick={verifyOTP}
              disabled={otpLoading || otp.length !== 6}
              className={`w-full py-4 rounded-xl mb-4 font-semibold text-lg transition-all duration-200 ${
                otpLoading || otp.length !== 6
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {otpLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-sm text-gray-600 mb-4">
              {resendTimer > 0 ? (
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-700">Resend code in <span className="font-semibold text-blue-600">{resendTimer}s</span></p>
                </div>
              ) : (
                <button
                  onClick={resendOTP}
                  className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              onClick={closeOTPModal}
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center border border-gray-200">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to your account</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
              <input
                  name="loginName"
                type="text"
                  placeholder="Enter your name"
                  value={loginName}
                  onChange={handleLoginChange}
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    loginError 
                      ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              />
            </div>
              <div>
                <input
                  name="loginPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={handleLoginChange}
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    loginError 
                      ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                  <span>⚠️</span> {loginError}
                </p>
              )}
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4"
            >
              Sign In
            </button>
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
                setLoginName('');
                setLoginPassword('');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            >
              Cancel
            </button>
          </div>
                 </div>
       )}

      {/* Terms and Conditions Modal */}
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
                   <p>• We suggest you to have a separate bank account for this platform to avoid any complications</p>
                   
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

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center border border-gray-200">
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔑</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {forgotPasswordStep === 1 && 'Reset Password'}
                {forgotPasswordStep === 2 && 'Verify Code'}
                {forgotPasswordStep === 3 && 'Set New Password'}
              </h2>
              <p className="text-gray-600 text-sm">
                {forgotPasswordStep === 1 && 'Enter your email address to receive a reset code'}
                {forgotPasswordStep === 2 && 'Enter the 6-digit code sent to your email'}
                {forgotPasswordStep === 3 && 'Create a new password for your account'}
              </p>
            </div>
            
            {forgotPasswordStep === 1 && (
              <div className="space-y-4 mb-6">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotPasswordEmail}
                    onChange={(e) => {
                      setForgotPasswordEmail(e.target.value);
                      if (forgotPasswordError) setForgotPasswordError('');
                    }}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      forgotPasswordError 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  />
                </div>
                {forgotPasswordError && (
                  <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                    <span>⚠️</span> {forgotPasswordError}
                  </p>
                )}
                <button
                  onClick={sendForgotPasswordOTP}
                  disabled={forgotPasswordLoading || !forgotPasswordEmail.trim()}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    forgotPasswordLoading || !forgotPasswordEmail.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {forgotPasswordLoading ? 'Sending Code...' : 'Send Reset Code'}
                </button>
              </div>
            )}

            {forgotPasswordStep === 2 && (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 text-sm">
                    We sent a 6-digit code to
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">{forgotPasswordEmail}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Check your email and enter the code below
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={forgotPasswordOtp}
                    onChange={(e) => {
                      setForgotPasswordOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (forgotPasswordError) setForgotPasswordError('');
                    }}
                    className={`w-full border-2 px-6 py-4 rounded-xl text-center text-2xl font-mono tracking-widest text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      forgotPasswordError 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-gray-300 bg-white focus:ring-orange-500 focus:border-orange-500'
                    }`}
                    maxLength="6"
                  />
                </div>
                {forgotPasswordError && (
                  <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                    <span>⚠️</span> {forgotPasswordError}
                  </p>
                )}
                <button
                  onClick={verifyForgotPasswordOTP}
                  disabled={forgotPasswordLoading || forgotPasswordOtp.length !== 6}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    forgotPasswordLoading || forgotPasswordOtp.length !== 6
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {forgotPasswordLoading ? 'Verifying...' : 'Verify Code'}
                </button>
                <div className="text-sm text-gray-600">
                  {forgotPasswordResendTimer > 0 ? (
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-gray-700">Resend code in <span className="font-semibold text-orange-600">{forgotPasswordResendTimer}s</span></p>
                    </div>
                  ) : (
                    <button
                      onClick={resendForgotPasswordOTP}
                      className="text-orange-600 hover:text-orange-800 font-medium underline transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}

            {forgotPasswordStep === 3 && (
              <div className="space-y-4 mb-6">
                <div>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (forgotPasswordError) setForgotPasswordError('');
                    }}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      forgotPasswordError 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (forgotPasswordError) setForgotPasswordError('');
                    }}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      forgotPasswordError 
                        ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  />
                </div>
                {forgotPasswordError && (
                  <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                    <span>⚠️</span> {forgotPasswordError}
                  </p>
                )}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-orange-800 mb-1">Password Requirements:</h4>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• One uppercase letter (A-Z)</li>
                    <li>• One lowercase letter (a-z)</li>
                    <li>• One number (0-9)</li>
                    <li>• One special character (@$!%*?&)</li>
                  </ul>
                </div>
                <button
                  onClick={resetPassword}
                  disabled={forgotPasswordLoading || !newPassword.trim() || !confirmNewPassword.trim()}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    forgotPasswordLoading || !newPassword.trim() || !confirmNewPassword.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            )}
            
            <button
              onClick={closeForgotPasswordModal}
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            >
              Cancel
            </button>
           </div>
         </div>
       )}
     </>
   );
 };

export default OwnerDetails;
