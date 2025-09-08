import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Home, Key, User, Mail, Phone, Lock, Shield, Star, MapPin, Heart } from 'lucide-react';
import bgHero from '../../assets/image.png';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptTerms: false
  });
  const [forgotForm, setForgotForm] = useState({
    email: ''
  });

  // Modals state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  
  // Password reset states
  const [showResetOtpModal, setShowResetOtpModal] = useState(false);
  const [resetOtpCode, setResetOtpCode] = useState('');
  const [resetOtpMsg, setResetOtpMsg] = useState('');
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log('🚨 AuthModal is rendering! isOpen:', isOpen);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint, data;

      if (activeTab === 'login') {
        endpoint = 'login';
        data = loginForm;
      } else if (activeTab === 'signup') {
        if (signupForm.password !== signupForm.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!signupForm.acceptTerms) {
          setError('You must accept the Terms & Conditions to create an account');
          setLoading(false);
          return;
        }
        endpoint = 'register';
        data = {
          username: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          phone: signupForm.phone
        };
      } else if (activeTab === 'forgot') {
        // Always use OTP method for password reset
        const otpResponse = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotForm.email, purpose: 'password_reset' })
        });
        
        if (!otpResponse.ok) {
          const otpResult = await otpResponse.json();
          throw new Error(otpResult.error || 'Failed to send OTP');
        }
        
        setOtpEmail(forgotForm.email);
        setShowResetOtpModal(true);
        setForgotSuccess('✅ OTP sent! Check your email and enter the code below.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      if (activeTab === 'forgot') {
        // Inline success UI instead of alert
        setForgotSuccess(result?.message || 'If an account exists, a reset link has been sent to your email.');
        setError('');
        return;
      } else if (activeTab === 'signup') {
        // OTP was already sent during registration, just show the verification modal
        setOtpEmail(signupForm.email);
        setOtpMsg('✅ We emailed you a 6-digit code');
        setShowOtpModal(true);
        setError('');
        return;
      } else {
        // Pass auth data to parent and persist a lightweight flag/token
        const authData = { token: result.token, user: result.user };
        try {
          if (result?.token) {
            localStorage.setItem('auth_token', result.token);
          }
          localStorage.setItem('has_authed', '1');
          const uid = result?.user?.id ?? result?.user?.userId ?? result?.user?.user_id;
          if (uid) {
            localStorage.setItem('user_id', String(uid));
            localStorage.setItem('user_data', JSON.stringify(result.user));
          }
        } catch (e) {
          // Ignore storage errors
        }
        onAuthSuccess(authData);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({
      emailOrUsername: '',
      password: ''
    });
    setSignupForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      acceptTerms: false
    });
    setForgotForm({
      email: ''
    });
    setError('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForms();
  };

  // Early return if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '128px',   // space for fixed navbar (~80-100px) + breathing room
        paddingBottom: '160px' // space for footer height + breathing room
      }}
    >
      {/* HouseDetails-style translucent overlay */}
      <div className="w-full bg-white/50 backdrop-blur-sm pt-8 pb-8 px-4 sm:px-6">
        <div className="flex items-stretch justify-center w-full">
          <div
            className="rounded-2xl shadow-2xl w-full lg:flex overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.0)',
              borderRadius: '16px',
              width: 'min(1500px, 100vw)',
              height: 'auto',
              overflow: 'visible',
              boxShadow: '0 30px 80px rgba(139, 69, 19, 0.4)'
            }}
          >
            {/* Left: brand/info panel (large screens) */}
            <div
              className="hidden lg:flex flex-col justify-center text-white p-12 lg:w-2/5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,rgba(161, 155, 150, 0.22) 0%,rgb(173, 166, 162) 25%,rgb(168, 161, 153) 50%,rgb(105, 104, 102) 75%, #F4A460 100%)', backgroundColor: 'rgba(139,69,19,0.9)' }}
            >
              {/* Decorative icons */}
              <div className="absolute top-6 right-6 opacity-20">
                <Home size={48} style={{ color: '#F4A460' }} />
              </div>
              <div className="absolute bottom-10 left-8 opacity-20">
                <Key size={40} style={{ color: '#F4A460' }} />
              </div>
              <div className="absolute top-1/2 left-10 opacity-15">
                <MapPin size={36} style={{ color: '#F4A460' }} />
              </div>
              
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Home size={56} style={{ color: '#F4A460' }} />
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-4" style={{ color: '#F4A460' }}>
                  🏠 Smart Boarding
                </h3>
                <p className="opacity-90 mb-8 text-lg" style={{ color: '#F5DEB3' }}>
                  Find and manage your ideal boarding house with ease.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                      <Shield size={24} style={{ color: '#F4A460' }} />
                    </div>
                    <span className="text-base" style={{ color: '#F5DEB3' }}>Secure authentication</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                      <Star size={24} style={{ color: '#F4A460' }} />
                    </div>
                    <span className="text-base" style={{ color: '#F5DEB3' }}>Fast access to details</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                      <Heart size={24} style={{ color: '#F4A460' }} />
                    </div>
                    <span className="text-base" style={{ color: '#F5DEB3' }}>Seamless booking flow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form panel with translucent background */}
            <div className="w-full p-6 sm:p-10 lg:w-3/5 flex flex-col" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b mb-6" style={{ borderColor: '#DEB887' }}>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#F4A460' }}>
                    <Key size={28} style={{ color: '#8B4513' }} />
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold" style={{ color: '#8B4513' }}>
                    {activeTab === 'login' && '🔑 Welcome Back'}
                    {activeTab === 'signup' && '✨ Create Account'}
                    {activeTab === 'forgot' && '🔓 Reset Password'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  style={{ color: '#A0522D' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b mb-2" style={{ borderColor: '#DEB887' }}>
                <button
                  onClick={() => handleTabChange('login')}
                  className="flex-1 py-4 px-4 text-sm sm:text-base font-medium transition-colors flex items-center justify-center space-x-3"
                  style={activeTab === 'login' ? { color: '#8B4513', borderBottom: '3px solid #8B4513' } : { color: '#A0522D' }}
                >
                  <Key size={18} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleTabChange('signup')}
                  className="flex-1 py-4 px-4 text-sm sm:text-base font-medium transition-colors flex items-center justify-center space-x-3"
                  style={activeTab === 'signup' ? { color: '#8B4513', borderBottom: '3px solid #8B4513' } : { color: '#A0522D' }}
                >
                  <User size={18} />
                  <span>Sign Up</span>
                </button>
                <button
                  onClick={() => handleTabChange('forgot')}
                  className="flex-1 py-4 px-4 text-sm sm:text-base font-medium transition-colors flex items-center justify-center space-x-3"
                  style={activeTab === 'forgot' ? { color: '#8B4513', borderBottom: '3px solid #8B4513' } : { color: '#A0522D' }}
                >
                  <Lock size={18} />
                  <span>Forgot</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6" style={{ overflow: 'visible' }}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg text-base flex items-center space-x-3">
                    <span>⚠️</span>
                    <span>{error}</span>
                    {error.includes('verify your email') && (
                      <div className="mt-2 text-sm">
                        <p>💡 <strong>Next steps:</strong></p>
                        <p>1. Check your email for the verification code</p>
                        <p>2. Enter the code in the verification modal</p>
                        <p>3. Then try logging in again</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <Mail size={18} style={{ color: '#8B4513' }} />
                        <span>Email or Username</span>
                      </label>
                      <input
                        type="text"
                        value={loginForm.emailOrUsername}
                        onChange={(e) => setLoginForm({ ...loginForm, emailOrUsername: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        style={{ borderColor: '#DEB887' }}
                        placeholder="Enter your email or username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <Lock size={18} style={{ color: '#8B4513' }} />
                        <span>Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full px-4 py-4 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                          style={{ borderColor: '#DEB887' }}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                          style={{ color: '#A0522D' }}
                        >
                          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signup Form */}
                {activeTab === 'signup' && (
                  <div className="flex-1 flex flex-col space-y-6" style={{ overflow: 'visible' }}>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                          <User size={18} style={{ color: '#8B4513' }} />
                          <span>First Name</span>
                        </label>
                        <input
                          type="text"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                          className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                          style={{ borderColor: '#DEB887' }}
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                          <User size={18} style={{ color: '#8B4513' }} />
                          <span>Last Name</span>
                        </label>
                        <input
                          type="text"
                          value={signupForm.lastName}
                          onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                          className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                          style={{ borderColor: '#DEB887' }}
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <User size={18} style={{ color: '#8B4513' }} />
                        <span>Username *</span>
                      </label>
                      <input
                        type="text"
                        value={signupForm.username}
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        style={{ borderColor: '#DEB887' }}
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <Mail size={18} style={{ color: '#8B4513' }} />
                        <span>Email *</span>
                      </label>
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        style={{ borderColor: '#DEB887' }}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <Phone size={18} style={{ color: '#8B4513' }} />
                        <span>Phone (Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        style={{ borderColor: '#DEB887' }}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                          <Lock size={18} style={{ color: '#8B4513' }} />
                          <span>Password *</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            className="w-full px-4 py-4 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                            style={{ borderColor: '#DEB887' }}
                            placeholder="Create a password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            style={{ color: '#A0522D' }}
                          >
                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3 flex items-centered space-x-3">
                          <Lock size={18} style={{ color: '#8B4513' }} />
                          <span>Confirm Password *</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-4 pr-12 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                            style={{ borderColor: '#DEB887' }}
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            style={{ color: '#A0522D' }}
                          >
                            {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Forgot Password Form */}
                {activeTab === 'forgot' && (
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3 flex items-center space-x-3">
                        <Mail size={18} style={{ color: '#8B4513' }} />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={forgotForm.email}
                        onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                        className="w-full px-4 py-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        style={{ borderColor: '#DEB887' }}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* OTP Password Reset Info */}
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      <p>🔐 <strong>OTP Password Reset:</strong> We'll send a 6-digit code to your email.</p>
                    </div>

                    {forgotSuccess && (
                      <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {forgotSuccess}
                      </div>
                    )}

                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-auto pt-6">
                  {activeTab === 'signup' && (
                    <div className="mb-4 flex items-start gap-3 bg-amber-50/60 border border-amber-200 rounded-lg p-4">
                      <input
                        id="acceptTermsAbove"
                        type="checkbox"
                        checked={signupForm.acceptTerms}
                        onChange={(e) => setSignupForm({ ...signupForm, acceptTerms: e.target.checked })}
                        className="mt-1 h-5 w-5 border-2 rounded focus:ring-amber-500"
                        style={{ borderColor: '#DEB887' }}
                      />
                      <label htmlFor="acceptTermsAbove" className="text-sm text-gray-700">
                        I agree to the
                        <button type="button" onClick={() => setShowTermsModal(true)} className="ml-1 font-semibold underline"
                          style={{ color: '#8B4513' }}>
                          Terms & Conditions
                        </button>
                        .
                      </label>
                    </div>
                  )}
                  {activeTab === 'signup' && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                      <p>💡 <strong>Important:</strong> After creating your account, you'll receive a verification code via email. You must verify your email before you can log in.</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-white py-4 px-6 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-3 hover:scale-105 text-lg font-semibold"
                    style={{ backgroundColor: '#8B4513' }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        {activeTab === 'login' && <Key size={24} />}
                        {activeTab === 'signup' && <User size={24} />}
                        {activeTab === 'forgot' && <Mail size={24} />}
                        <span>
                          {activeTab === 'login' ? '🔑 Sign In' :
                           activeTab === 'signup' ? '✨ Create Account' :
                           '🔐 Send OTP Code'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 rounded-lg mt-6" style={{ backgroundColor: '#F5DEB3' }}>
                <p className="text-sm text-gray-600 text-center">
                  {activeTab === 'login' && "Don't have an account? "}
                  {activeTab === 'signup' && 'Already have an account? '}
                  {activeTab === 'forgot' && 'Remember your password? '}
                  <button
                    onClick={() => handleTabChange(activeTab === 'login' ? 'signup' : 'login')}
                    className="font-medium hover:underline transition-all duration-200 ml-1"
                    style={{ color: '#8B4513' }}
                  >
                    {activeTab === 'login' ? '✨ Sign up' : '🔑 Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* Terms Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40" style={{ zIndex: 70 }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Terms & Conditions</h3>
                <button onClick={() => setShowTermsModal(false)} className="p-2 rounded hover:bg-gray-100"><X size={20} /></button>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-3 text-sm text-gray-700">
                <p>By creating an account, you agree to abide by our community guidelines, provide accurate information, and consent to communications related to your account and bookings.</p>
                <p>You also acknowledge that your email must be verified before you can access your account.</p>
                <p>Misuse of the platform may result in account suspension.</p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowTermsModal(false)} className="px-4 py-2 rounded border" style={{ borderColor: '#DEB887', color: '#8B4513' }}>Cancel</button>
                <button onClick={() => { setSignupForm({ ...signupForm, acceptTerms: true }); setShowTermsModal(false); }} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: '#8B4513', color: '#fff' }}>I Accept</button>
              </div>
            </div>
          </div>
        )}

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Verify your email</h3>
                <button onClick={() => setShowOtpModal(false)} className="p-2 rounded hover:bg-gray-100"><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <span className="font-semibold">{otpEmail}</span>. Enter it below to complete signup.</p>
              {otpMsg && <div className="mb-3 text-sm" style={{ color: otpMsg.startsWith('✅') ? '#166534' : '#7f1d1d' }}>{otpMsg}</div>}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg mb-4"
                style={{ borderColor: '#DEB887' }}
                placeholder="Enter 6-digit code"
              />
              <div className="flex justify-between gap-3">
                <button
                  onClick={async () => {
                    try {
                      setOtpMsg('');
                      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpEmail, otp: otpCode, purpose: 'verification' })
                      });
                      const raw = await res.text();
                      let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
                      if (!res.ok) throw new Error(data.error || 'Invalid code');
                      setOtpMsg('✅ Verified! Logging you in...');
                      // simulate login success path
                      localStorage.setItem('has_authed', '1');
                      if (data?.token) localStorage.setItem('auth_token', data.token);
                      if (data?.user?.id || data?.user?.userId || data?.user?.user_id) {
                        try {
                          const uid = data.user.id ?? data.user.userId ?? data.user.user_id;
                          localStorage.setItem('user_id', String(uid));
                          localStorage.setItem('user_data', JSON.stringify(data.user));
                        } catch {}
                      }
                      onAuthSuccess({ token: data?.token, user: data?.user });
                      setShowOtpModal(false);
                    } catch (e) {
                      setOtpMsg(`❌ ${e.message}`);
                    }
                  }}
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: '#8B4513', color: '#fff' }}
                >
                  Verify
                </button>
                <button
                  onClick={async () => {
                    try {
                      setOtpMsg('');
                      const res = await fetch(`http://localhost:5000/api/auth/send-otp`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpEmail, purpose: 'verification' })
                      });
                      const raw = await res.text();
                      let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
                      if (!res.ok) {
                        if (data.error && data.error.includes('already sent')) {
                          setOtpMsg('⚠️  OTP already sent. Please check your email.');
                        } else {
                          throw new Error(data.error || 'Failed to resend');
                        }
                      } else {
                        setOtpMsg('✅ Code resent');
                      }
                    } catch (e) {
                      setOtpMsg(`❌ ${e.message}`);
                    }
                  }}
                  className="px-4 py-3 rounded border"
                  style={{ borderColor: '#DEB887', color: '#8B4513' }}
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset OTP Modal */}
        {showResetOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Reset Password</h3>
                <button onClick={() => setShowResetOtpModal(false)} className="p-2 rounded hover:bg-gray-100"><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <span className="font-semibold">{otpEmail}</span>. Enter it below to reset your password.</p>
              {resetOtpMsg && <div className="mb-3 text-sm" style={{ color: resetOtpMsg.startsWith('✅') ? '#166534' : '#7f1d1d' }}>{resetOtpMsg}</div>}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={resetOtpCode}
                onChange={(e) => setResetOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg mb-4"
                style={{ borderColor: '#DEB887' }}
                placeholder="Enter 6-digit code"
              />
              <div className="flex justify-between gap-3">
                <button
                  onClick={async () => {
                    try {
                      setResetOtpMsg('');
                      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpEmail, otp: resetOtpCode, purpose: 'password_reset' })
                      });
                      const raw = await res.text();
                      let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
                      if (!res.ok) throw new Error(data.error || 'Invalid code');
                      setResetOtpMsg('✅ Code verified! Now set your new password.');
                      setShowResetOtpModal(false);
                      setShowNewPasswordModal(true);
                    } catch (e) {
                      setResetOtpMsg(`❌ ${e.message}`);
                    }
                  }}
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: '#8B4513', color: '#fff' }}
                >
                  Verify Code
                </button>
                <button
                  onClick={async () => {
                    try {
                      setResetOtpMsg('');
                      const res = await fetch(`http://localhost:5000/api/auth/send-otp`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpEmail, purpose: 'password_reset' })
                      });
                      const raw = await res.text();
                      let data; try { data = JSON.parse(raw); } catch { data = { error: raw }; }
                      if (!res.ok) {
                        if (data.error && data.error.includes('already sent')) {
                          setResetOtpMsg('⚠️  OTP already sent. Please check your email.');
                        } else {
                          throw new Error(data.error || 'Failed to resend');
                        }
                      } else {
                        setResetOtpMsg('✅ Code resent');
                      }
                    } catch (e) {
                      setResetOtpMsg(`❌ ${e.message}`);
                    }
                  }}
                  className="px-4 py-3 rounded border"
                  style={{ borderColor: '#DEB887', color: '#8B4513' }}
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Password Modal */}
        {showNewPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#8B4513' }}>Set New Password</h3>
                <button onClick={() => setShowNewPasswordModal(false)} className="p-2 rounded hover:bg-gray-100"><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Enter your new password below.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                      style={{ borderColor: '#DEB887' }}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      style={{ color: '#A0522D' }}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                      style={{ borderColor: '#DEB887' }}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                      style={{ color: '#A0522D' }}
                    >
                      {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  onClick={() => setShowNewPasswordModal(false)}
                  className="px-4 py-2 rounded border"
                  style={{ borderColor: '#DEB887', color: '#8B4513' }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (newPassword !== confirmNewPassword) {
                      alert('Passwords do not match!');
                      return;
                    }
                    if (newPassword.length < 6) {
                      alert('Password must be at least 6 characters long!');
                      return;
                    }
                    
                    try {
                      const res = await fetch('http://localhost:5000/api/auth/reset-password-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          email: otpEmail, 
                          otp: resetOtpCode, 
                          newPassword: newPassword 
                        })
                      });
                      
                      if (!res.ok) {
                        const result = await res.json();
                        throw new Error(result.error || 'Failed to reset password');
                      }
                      
                      alert('✅ Password reset successfully! You can now login with your new password.');
                      setShowNewPasswordModal(false);
                      setActiveTab('login');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setResetOtpCode('');
                      setForgotForm({ email: '' });
                    } catch (e) {
                      alert(`❌ Error: ${e.message}`);
                    }
                  }}
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: '#8B4513', color: '#fff' }}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AuthModal;
