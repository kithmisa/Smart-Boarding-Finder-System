import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Bank, Smartphone, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';

const PaymentGateway = () => {
  const { id } = useParams(); // house id
  const navigate = useNavigate();
  const location = useLocation();
  
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  // Get booking details from location state
  const bookingDetails = location.state?.bookingDetails;
  const isVisit = location.state?.type === 'visit';

  useEffect(() => {
    if (!bookingDetails) {
      navigate(`/boarding/${id}`);
      return;
    }
  }, [bookingDetails, id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initiatePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingDetails.bookingId,
          amount: isVisit ? bookingDetails.amount : bookingDetails.advancePayment,
          customerFirstName: customerInfo.firstName,
          customerLastName: customerInfo.lastName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          customerCity: customerInfo.city
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentData(data);
        // Redirect to PayHere
        redirectToPayHere(data.payhere);
      } else {
        setError(data.message || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayHere = (payhereData) => {
    // Create a form and submit to PayHere
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payhereData.url;
    form.target = '_blank';

    // Add all PayHere required fields
    Object.entries(payhereData.data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of required) {
      if (!customerInfo[field].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    setError(null);
    return true;
  };

  const handleManualPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingDetails.bookingId,
          amount: isVisit ? bookingDetails.amount : bookingDetails.advancePayment,
          paymentMethod: 'manual',
          notes: 'Manual payment confirmation'
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('completed');
        setTimeout(() => {
          navigate(`/boarding/${id}?payment=success`);
        }, 2000);
      } else {
        setError(data.message || 'Failed to create payment record');
      }
    } catch (err) {
      console.error('Manual payment error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return null;
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '100px auto 0',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate(`/boarding/${id}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={20} />
          Back to Property
        </button>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          Payment Gateway
        </h1>
        
        <p style={{ color: '#666', fontSize: '16px' }}>
          {isVisit ? 'Visit Booking Payment' : 'Stay Booking Payment'}
        </p>
      </div>

      {/* Payment Summary */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '2px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Payment Summary</h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Property:</strong></span>
            <span>{bookingDetails.houseTitle}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Booking Type:</strong></span>
            <span style={{ 
              textTransform: 'capitalize',
              color: isVisit ? '#28a745' : '#007bff'
            }}>
              {isVisit ? 'Visit' : 'Stay'}
            </span>
          </div>
          
          {isVisit ? (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>Visit Date:</strong></span>
              <span>{new Date(bookingDetails.visitDate).toLocaleDateString()}</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Check-in:</strong></span>
                <span>{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Check-out:</strong></span>
                <span>{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Total Nights:</strong></span>
                <span>{Math.ceil((new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn)) / (1000 * 60 * 60 * 24))}</span>
              </div>
            </>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#007bff',
            paddingTop: '15px',
            borderTop: '2px solid #dee2e6'
          }}>
            <span>Amount to Pay:</span>
            <span>Rs. {isVisit ? bookingDetails.amount : bookingDetails.advancePayment}</span>
          </div>
          
          {!isVisit && (
            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px'
            }}>
              This is the advance payment (25%). Remaining amount will be collected upon check-in.
            </div>
          )}
        </div>
      </div>

      {/* Customer Information Form */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        border: '2px solid #e9ecef',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Customer Information</h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={customerInfo.firstName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={customerInfo.lastName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter last name"
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter address"
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '16px'
                }}
                placeholder="Enter city"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <XCircle size={20} />
          {error}
        </div>
      )}

      {/* Payment Methods */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        border: '2px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Payment Methods</h3>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* PayHere Integration */}
          <div style={{
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#f8f9ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <CreditCard size={24} color="#007bff" />
              <div>
                <h4 style={{ margin: 0, color: '#007bff', fontWeight: '600' }}>
                  Secure Online Payment
                </h4>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                  Pay securely with PayHere (Credit/Debit Cards, Digital Wallets)
                </p>
              </div>
            </div>
            
            <button
              onClick={initiatePayment}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay with PayHere
                </>
              )}
            </button>
          </div>

          {/* Manual Payment Option */}
          <div style={{
            border: '2px solid #28a745',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#f8fff9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <Bank size={24} color="#28a745" />
              <div>
                <h4 style={{ margin: 0, color: '#28a745', fontWeight: '600' }}>
                  Manual Payment
                </h4>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                  Bank transfer, cash payment, or other methods
                </p>
              </div>
            </div>
            
            <button
              onClick={handleManualPayment}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Bank size={20} />
                  Confirm Manual Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === 'completed' && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <CheckCircle size={60} color="#28a745" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#28a745', marginBottom: '10px' }}>Payment Successful!</h3>
          <p style={{ color: '#666' }}>Redirecting to property page...</p>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentGateway;

