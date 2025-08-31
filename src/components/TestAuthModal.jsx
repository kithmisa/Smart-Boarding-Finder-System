import React, { useState, useEffect } from 'react';

const TestAuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  console.log('🔍 TestAuthModal render - isOpen:', isOpen);
  
  const [activeTab, setActiveTab] = useState('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) {
    console.log('❌ TestAuthModal: isOpen is false, returning null');
    return null;
  }

  console.log('✅ TestAuthModal: isOpen is true, rendering modal');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onAuthSuccess();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        minWidth: '400px',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid #e1e5e9'
      }}>
        <h2 style={{
          margin: '0 0 25px 0', 
          textAlign: 'center', 
          color: '#1a1a1a',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
        </h2>
        
        <h3 style={{
          margin: '0 0 25px 0', 
          textAlign: 'center', 
          color: '#1a1a1a',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
        </h3>
        
        <div style={{marginBottom: '25px', display: 'flex', gap: '2px'}}>
          <button 
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: activeTab === 'signup' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'signup' ? 'white' : '#6c757d',
              border: '1px solid #dee2e6',
              borderBottom: activeTab === 'signup' ? '2px solid #007bff' : '1px solid #dee2e6',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
          <button 
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: activeTab === 'login' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'login' ? 'white' : '#6c757d',
              border: '1px solid #dee2e6',
              borderBottom: activeTab === 'login' ? '2px solid #007bff' : '1px solid #dee2e6',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <>
              <div style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057'
                }}>Username:</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s ease'
                  }}
                  required
                />
              </div>
              <div style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#495057'
                }}>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s ease'
                  }}
                  required
                />
              </div>
            </>
          )}
          
          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#495057'
            }}>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ced4da',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s ease'
              }}
              required
            />
          </div>

          {activeTab === 'signup' && (
            <div style={{marginBottom: '25px'}}>
              <label style={{
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500',
                color: '#495057'
              }}>Confirm Password:</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ced4da',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s ease'
                }}
                required
              />
            </div>
          )}

          <div style={{display: 'flex', gap: '15px'}}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.2s ease'
              }}
            >
              {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestAuthModal;
