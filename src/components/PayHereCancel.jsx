import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import bgHero from '../assets/image.png';

const PayHereCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('order_id');
  // const statusCode = searchParams.get('status_code'); // Available for future use
  const statusMessage = searchParams.get('status_message');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) {
        setError('No order ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/payments/payhere/${orderId}/status`);
        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.payment);
        } else {
          setError('Failed to verify payment status');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError('Failed to verify payment status');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  const handleRetryPayment = () => {
    if (paymentStatus?.type === 'listing_fee') {
      navigate('/register/house/payment');
    } else if (paymentStatus?.type === 'booking') {
      navigate('/payment');
    } else {
      navigate('/payment');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          className="relative flex-grow px-8 pt-32 pb-16 text-white min-h-screen"
          style={{
            backgroundImage: `url(${bgHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="pt-10 pb-20 min-h-screen px-4">
            <div className="max-w-2xl mx-auto bg-white/80 shadow-md rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Checking Payment Status</h2>
              <p className="text-gray-600">Please wait while we check your payment status...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div
          className="relative flex-grow px-8 pt-32 pb-16 text-white min-h-screen"
          style={{
            backgroundImage: `url(${bgHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="pt-10 pb-20 min-h-screen px-4">
            <div className="max-w-2xl mx-auto bg-white/80 shadow-md rounded-lg p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Verification Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="relative flex-grow px-8 pt-32 pb-16 text-white min-h-screen"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pt-10 pb-20 min-h-screen px-4">
          <div className="max-w-2xl mx-auto bg-white/80 shadow-md rounded-lg p-8 text-center">
            {/* Cancelled State */}
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled or failed to process. You can try again or contact support if you need assistance.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-red-800 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm text-red-700">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Amount:</strong> Rs. {paymentStatus?.amount}</p>
                <p><strong>Payment ID:</strong> {paymentId || paymentStatus?.paymentId}</p>
                <p><strong>Status:</strong> {statusMessage || paymentStatus?.statusMessage || 'Cancelled'}</p>
                {paymentStatus?.type === 'listing_fee' && (
                  <p><strong>Type:</strong> Property Listing Fee</p>
                )}
                {paymentStatus?.type === 'booking' && (
                  <p><strong>Type:</strong> Booking Payment</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Try Payment Again
              </button>
              
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Go Home
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                If you continue to experience issues, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PayHereCancel;
