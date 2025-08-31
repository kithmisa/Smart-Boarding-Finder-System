import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, isAuthenticated, onAuthRequired }) => {
  const navigate = useNavigate();

  const handleAuthRequired = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      // Default behavior: redirect to home and show auth modal
      navigate('/');
      // You can also trigger the auth modal here if needed
    }
  };

  if (!isAuthenticated) {
    // Show a message or trigger auth flow
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this feature. Please sign in or create an account to continue.
          </p>
          <button
            onClick={handleAuthRequired}
            className="bg-8B4513 text-white px-6 py-3 rounded-lg font-semibold hover:bg-A0522D transition-colors"
            style={{ backgroundColor: '#8B4513' }}
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;




