import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password reset failed');

      setSuccess(true);
      setTimeout(() => navigate('/boarding'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)' }}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full" style={{ boxShadow: '0 30px 80px rgba(139, 69, 19, 0.4)' }}>
          <div className="text-center text-red-600 mb-4">{error}</div>
          <button onClick={() => navigate('/boarding')} className="w-full text-white p-2 rounded transition-all duration-200 hover:scale-105" style={{ backgroundColor: '#8B4513' }}>
            Back to Boarding
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)' }}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center" style={{ boxShadow: '0 30px 80px rgba(139, 69, 19, 0.4)' }}>
          <div className="text-green-600 mb-4">✅ Password reset successful!</div>
          <div className="text-gray-600">Redirecting to boarding page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)' }}>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full" style={{ boxShadow: '0 30px 80px rgba(139, 69, 19, 0.4)' }}>
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#8B4513' }}>Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">Enter your new password below</p>
        
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full border rounded p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              style={{ borderColor: '#DEB887' }}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border rounded p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              style={{ borderColor: '#DEB887' }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white p-3 rounded hover:scale-105 disabled:opacity-50 transition-all duration-200"
            style={{ backgroundColor: '#8B4513' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <button
          onClick={() => navigate('/boarding')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Back to Boarding
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
