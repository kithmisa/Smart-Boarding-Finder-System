import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import bgHero from '../assets/image.png';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const bookingIdParam = searchParams.get('booking_id');
  const isOwner = searchParams.get('owner') === '1';
  const ownerAmount = searchParams.get('amount');
  const ownerHouse = searchParams.get('house');
  const bookingId = bookingIdParam || (typeof window !== 'undefined' ? localStorage.getItem('last_paid_booking_id') : null);

  useEffect(() => {
    // Simulate loading and set details (could be extended to fetch real data)
    const timer = setTimeout(() => {
      setLoading(false);
      setPaymentDetails({
        bookingId: isOwner ? 'Owner Listing Fee' : (bookingId || 'N/A'),
        amount: isOwner ? `Rs. ${ownerAmount || '0'}` : 'Rs. 0',
        status: 'Success',
        isOwner,
        ownerHouse
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [bookingId]);

  const handleBackToProfile = () => {
    const isOwner = searchParams.get('owner') === '1';
    if (isOwner) {
      navigate('/register/house');
      return;
    }
    const userId = localStorage.getItem('user_id');
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your payment...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
     
      <div
        className="relative flex-grow px-8 pt-32 pb-16 text-white"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md w-full space-y-8 mx-auto bg-white/80 shadow rounded-lg p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your payment has been processed successfully.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{paymentDetails?.isOwner ? 'Payment For:' : 'Booking ID:'}</span>
                <span className="font-semibold text-blue-700">{paymentDetails?.bookingId || bookingId || 'N/A'}</span>
              </div>
              {paymentDetails?.isOwner && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-semibold text-blue-700">{paymentDetails?.ownerHouse || 'Property'}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-blue-700">{paymentDetails?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold text-blue-700">Online</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleBackToProfile}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default PaymentSuccess;

