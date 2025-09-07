import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ownerPayment, setOwnerPayment] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Get booking or owner payment data on component mount
  useEffect(() => {
    try {
      const stateOwnerPayment = location?.state?.ownerPayment;
      let localOwnerPayment = null;
      try {
        const stored = localStorage.getItem('ownerPayment');
        if (stored) localOwnerPayment = JSON.parse(stored);
      } catch {}

      if (stateOwnerPayment || localOwnerPayment) {
        setOwnerPayment(stateOwnerPayment || localOwnerPayment);
      }

      const bookingData = localStorage.getItem('selectedBooking');
      if (bookingData && !(stateOwnerPayment || localOwnerPayment)) {
        setSelectedBooking(JSON.parse(bookingData));
      }

      if (!bookingData && !(stateOwnerPayment || localOwnerPayment)) {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          navigate(`/profile/${userId}`);
        } else {
          navigate('/');
        }
      }
    } catch {
      // On any error, fallback to home
      navigate('/');
    }
  }, [navigate, location]);

  // Allow only numeric input, limit to 16 digits, format as groups of 4
  const handleCardNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length <= 16) {
      if (input.length > 12) {
        input = `${input.substring(0, 4)} ${input.substring(4, 8)} ${input.substring(8, 12)} ${input.substring(12, 16)}`;
      } else if (input.length > 8) {
        input = `${input.substring(0, 4)} ${input.substring(4, 8)} ${input.substring(8, 12)}`;
      } else if (input.length > 4) {
        input = `${input.substring(0, 4)} ${input.substring(4, 8)}`;
      }
      setCardNumber(input);
    }
  };

  // Handle expiry date input (MM/YY format)
  const handleExpiryDateChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length >= 2) {
      input = `${input.substring(0, 2)}/${input.substring(2, 4)}`;
    }
    if (input.length <= 5) setExpiryDate(input);
  };

  // Handle CVV input (3 digits only)
  const handleCvvChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    if (input.length <= 3) setCvv(input);
  };

  // Handle simple payment
  const handleSimplePay = async () => {
    // Owner listing fee flow (no booking backend call)
    if (ownerPayment) {
      try {
        setIsPaying(true);
        // Record payment in backend payments table
        try {
          await fetch('http://localhost:5000/api/payments/listing/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              houseId: ownerPayment.house_id,
              ownerId: Number(localStorage.getItem('owner_id')) || undefined,
              amount: ownerPayment.total_payment,
              paymentMethod: 'manual',
              transactionId: `MANUAL_${Date.now()}`,
              notes: 'Owner listing fee'
            })
          });
        } catch (e) {
          console.warn('Listing payment record call failed (continuing):', e);
        }

        try {
          if (ownerPayment?.house_id) {
            localStorage.setItem(`owner_fee_paid_${ownerPayment.house_id}`, 'true');
          }
          localStorage.removeItem('ownerPayment');
        } catch {}
        setIsPaying(false);
        alert('Payment successful! Your listing fee has been received.');
        const params = new URLSearchParams({
          owner: '1',
          amount: String(ownerPayment.total_payment || 0),
          house: String(ownerPayment.title || 'Property')
        });
        navigate(`/payment/success?${params.toString()}`);
      } catch (error) {
        console.error('Error completing owner payment:', error);
        alert('Payment failed. Please try again.');
        setIsPaying(false);
      }
      return;
    }

    // Booking payment flow
    if (selectedBooking) {
      try {
        setIsPaying(true);
        const response = await fetch(`http://localhost:5000/api/bookings/stay/${selectedBooking.id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_status: 'paid',
            payment_method: 'manual'
          })
        });

        if (response.ok) {
          // Store booking id for success page and navigate with query
          try { localStorage.setItem('last_paid_booking_id', String(selectedBooking.id)); } catch {}
          navigate(`/payment/success?booking_id=${encodeURIComponent(selectedBooking.id)}`);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment failed');
        }
      } catch (error) {
        console.error('Error completing payment:', error);
        alert('Payment failed. Please try again.');
      } finally {
        setIsPaying(false);
      }
    }
  };

  const amountToPay = ownerPayment
    ? (ownerPayment.total_payment || 0)
    : (selectedBooking?.total_payment || 0);

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

      {/* Payment Form */}
      <div className="pt-10 pb-20  min-h-screen px-4">
        <div className="max-w-5xl mx-auto bg-white/80 shadow-md rounded-lg p-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => {
                if (ownerPayment) {
                  navigate('/register/house');
                  return;
                }
                const userId = localStorage.getItem('user_id');
                if (userId) {
                  navigate(`/profile/${userId}`);
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </button>
          </div>
          {/* Owner Listing Fee Summary */}
          {ownerPayment && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Owner Listing Fee</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">{ownerPayment.title || 'New Property'}</h3>
                  <p className="text-sm text-gray-600">{ownerPayment.address || ''}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Monthly Price:</strong> Rs. {ownerPayment.monthly_price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span>Listing Fee (10%): </span>
                      <span className="font-semibold text-lg text-orange-600">Rs. {ownerPayment.total_payment}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedBooking && !ownerPayment && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">{selectedBooking.house_title}</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.house_address}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Check-in:</strong> {new Date(selectedBooking.check_in_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Check-out:</strong> {new Date(selectedBooking.check_out_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span>Total Amount: </span>
                      <span className="font-semibold text-lg text-orange-600">Rs. {selectedBooking.total_payment}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Advance: Rs. {selectedBooking.advance_payment} | Service: Rs. {selectedBooking.service_charge}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Payment Details Form */}
          <form autoComplete="off">
  <input autoComplete="off" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Card Info */}
            <div>
              <h2 className="text-lg text-black font-semibold mb-2">Card Information</h2>
              <p className="text-sm text-black mb-4">
                Indicate details of the card from which money will be debited
              </p>

              {/* Card icons */}
              <div className="flex items-center gap-4 mb-3">
                <FaCcVisa className="text-4xl text-blue-600" />
                <FaCcMastercard className="text-4xl text-red-600" />
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9\\s]{19}"
                  placeholder="0000 0000 0000 0000"
                  autoComplete="off"
                  name="card_number_dummy"
                  aria-label="Card Number"
                  spellCheck={false}
                  autoCorrect="off"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded mb-4 text-gray-800 placeholder-gray-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month and Year
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      autoComplete="off"
                      name="cc_exp_dummy"
                      inputMode="numeric"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      autoComplete="off"
                      name="cc_cvv_dummy"
                      inputMode="numeric"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Personal Info */}
            <div>
              <h2 className="text-lg text-black font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded text-gray-800 placeholder-gray-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full text-gray-800 placeholder-gray-500"
              />
            </div>
          </div>
          </form>

          {/* Simple Payment Action */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-600">
              {ownerPayment
                ? 'Click the button below to pay your listing fee and complete property submission.'
                : 'Click the button below to confirm payment. This will mark your booking as paid.'}
            </p>
          </div>

          {/* Pay Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleSimplePay}
              disabled={isPaying || (!selectedBooking && !ownerPayment)}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full text-lg font-semibold transition-colors duration-200 ${isPaying ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPaying ? 'PROCESSING...' : `PAY Rs. ${amountToPay}`}
            </button>
            {/* Prevent HTTP autofill warning only for card fields, allow others */}
            <div style={{position:'absolute',left:'-9999px',height:0,overflow:'hidden'}} aria-hidden="true">
              <input type="text" name="cc-name" autoComplete="cc-name" />
              <input type="text" name="cc-number" autoComplete="cc-number" />
              <input type="text" name="cc-exp" autoComplete="cc-exp" />
              <input type="text" name="cc-csc" autoComplete="cc-csc" />
            </div>
          </div>
        </div>
      </div>
    </div>
     
    </>
  );
};

export default Payment;