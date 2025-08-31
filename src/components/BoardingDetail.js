import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, Users, Home, CreditCard, Check, Clock, Phone, Mail, User, Heart,Star } from 'lucide-react';
import bgHero from '../assets/image.png';


const BoardingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [stayDates, setStayDates] = useState({ checkIn: '', checkOut: '' });
  const [bookingStatus, setBookingStatus] = useState(''); // 'pending', 'confirmed', 'rejected'
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    title: '',
    comment: '',
    cleanliness: 5,
    location: 5,
    value: 5,
    amenities: 5
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/houses/${id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Handle different response formats from backend
          if (data && data.id) {
            // Direct house object (current backend format)
            setHouse(data);
          } else if (data.success && data.house) {
            // Wrapped in success object
            setHouse(data.house);
          } else if (data.house) {
            // Fallback for house property
            setHouse(data.house);
          } else {
            console.error("Invalid house data format. Expected house object with id, received:", data);
            setHouse(null);
          }
        } else {
          console.error("Failed to fetch house:", response.status, response.statusText);
        }
      } catch (err) {
        console.error("Failed to fetch house:", err);
        setHouse(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHouse();
      checkFavoriteStatus();
      fetchReviews();
    }
  }, [id]);

  // Check if house is in user's favorites
  const checkFavoriteStatus = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      const response = await fetch(`http://localhost:5000/api/users/favorites/check/${id}?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login to add favorites');
      return;
    }

    try {
      setFavoritesLoading(true);
      const response = await fetch('http://localhost:5000/api/users/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, houseId: id })
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
        alert(data.isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
      } else {
        alert('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Fetch reviews for this boarding place
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/boarding/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Submit new review
  const submitReview = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.title.trim()) {
      alert('Please provide a title for your review');
      return;
    }
    
    if (!newReview.comment.trim()) {
      alert('Please write a comment for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          boardingId: id,
          rating: newReview.rating,
          title: newReview.title.trim(),
          comment: newReview.comment.trim(),
          cleanliness: newReview.cleanliness,
          location: newReview.location,
          value: newReview.value,
          amenities: newReview.amenities
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setNewReview({ 
          rating: 5, 
          title: '',
          comment: '',
          cleanliness: 5,
          location: 5,
          value: 5,
          amenities: 5
        });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        const errorData = await response.text();
        console.error('Review submission failed:', response.status, errorData);
        alert(`Failed to submit review: ${response.status === 400 ? 'Invalid data provided' : 'Server error'}. Please try again.`);
      }
    } catch (error) {
      console.error('Network error submitting review:', error);
      alert('Network error: Please check your connection and try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!house) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#dc3545'
      }}>
        House not found
      </div>
    );
  }

  // Handle images - your backend stores them as JSON string
  const cleanedImages = Array.isArray(house.images) ? house.images : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === cleanedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? cleanedImages.length - 1 : prev - 1
    );
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleVisitBooking = async () => {
    if (!visitDate) {
      alert('Please select a visit date');
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login to book a visit');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/visit-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardingId: id,
          requestedDate: visitDate,
          userId: parseInt(userId),
          message: 'Visit request submitted through website'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Visit request submitted successfully:', data);
        alert('✅ Visit request submitted successfully!\n\nYour visit request has been sent to the property owner. You will be notified once the owner confirms or provides alternative dates.\n\nYou can check the status in your profile under "My Visit Requests".');
        setVisitDate(''); // Reset the form
      } else {
        const errorData = await response.text();
        console.error('Visit booking failed:', response.status, errorData);
        alert(`Failed to book visit: ${response.status === 500 ? 'Server error' : 'Invalid request'}. Please try again.`);
      }
    } catch (error) {
      console.error('Network error during visit booking:', error);
      alert('Network error: Please check your connection and try again.');
    }
  };

  const handleStayBooking = async () => {
    if (!stayDates.checkIn || !stayDates.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (new Date(stayDates.checkIn) >= new Date(stayDates.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('Please login to book a stay');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings/stay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseId: id,
          checkIn: stayDates.checkIn,
          checkOut: stayDates.checkOut,
          userId: parseInt(userId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to payment gateway with booking details
        navigate(`/boarding/${id}/payment`, {
          state: {
            type: 'stay',
            bookingDetails: {
              bookingId: data.booking.id,
              houseTitle: house.title,
              checkIn: stayDates.checkIn,
              checkOut: stayDates.checkOut,
              totalAmount: calculateStayPrice(),
              advancePayment: calculateAdvancePayment()
            }
          }
        });
      } else {
        alert('Failed to book stay. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const handlePayment = async () => {
    // Simulate payment processing
    setTimeout(() => {
      setBookingStatus('paid');
      setShowPayment(false);
      alert('Payment successful! Your booking is confirmed.');
    }, 2000);
  };

  const calculateStayPrice = () => {
    if (!stayDates.checkIn || !stayDates.checkOut || !house.pricePerNight) return 0;
    
    const checkIn = new Date(stayDates.checkIn);
    const checkOut = new Date(stayDates.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * house.pricePerNight : 0;
  };

  const calculateAdvancePayment = () => {
  return calculateStayPrice() / 4;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div
      className="relative flex-grow text-white min-h-screen"
      style={{
        backgroundImage: `url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Main Content with Single Backdrop Blur Overlay */}
      <div className="pt-40 pb-20 px-4 min-h-screen">
        <div className="max-w-[1500px] mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-0xl shadow-2xl p-8">
            
            {/* Hero Title Section */}

            {averageRating > 0 && (
                   
                      <div className="flex justify-center items-center gap-3">
                        <div className="flex justify-center items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star}
                              className={`text-3xl ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-gray-600">
                            {averageRating.toFixed(1)}
                          </span>
                          <p className="text-sm text-gray-600 inline">
                            (Based on {reviews.length} review{reviews.length !== 1 ? 's)' : ''}
                          </p>
                        </div>
                      </div>
                   
                  )}


            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
                {house?.title || 'Boarding Details'}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                📍 {house?.address}, {house?.city}
              </p>
              <div className="flex justify-center items-center gap-4 text-lg flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  🏠 {house?.type}
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  💰 Rs. {house?.price}
                </span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  👥 {house?.genderAllowed}
                </span>
                {house?.shortTerm && (
                  <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                    🌙 Rs. {house?.pricePerNight}/night
                  </span>
                )}
              </div>
            </div>

            {/* Content Container - Rearranged Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Left Column - Image Gallery (3/5 width) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Image Gallery Card */}
          {cleanedImages.length > 0 && (
                  <div className="bg-white/0 backdrop-blur-m rounded-lg shadow-xl p-6 border border-white-800">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Gallery</h3>
                    <div className="relative">
                      <div className="relative h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100 ">
                <img
                  src={`http://localhost:5000/uploads/${cleanedImages[currentImageIndex]}`}
                  alt={`House ${currentImageIndex}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() => setIsImageModalOpen(true)}
                  onError={e => {
                    console.error('Image failed to load:', cleanedImages[currentImageIndex]);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {cleanedImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 transition-all duration-200"
                            >
                              <ChevronLeft size={24} />
                    </button>
                    
                    <button
                      onClick={nextImage}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-90 transition-all duration-200"
                            >
                              <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                        {/* Image Counter */}
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                  {currentImageIndex + 1} / {cleanedImages.length}
                        </div>
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              {cleanedImages.length > 1 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-2 ">
                  {cleanedImages.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${img}`}
                      alt={`Thumbnail ${index}`}
                            className={`w-20 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all duration-200 ${
                              index === currentImageIndex 
                                ? 'ring-3 ring-blue-500 scale-105 ' 
                                : 'hover:scale-105 opacity-70 hover:opacity-100 '
                            }`}
                      onClick={() => setCurrentImageIndex(index)}
                            onError={e => e.currentTarget.style.display = 'none'}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

              {/* Right Column - Property Details (2/5 width) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Property Information Card */}
                <div className="bg-white/50 backdrop-blur-m rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Home className="text-blue-600" />
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <span className="font-semibold">Room Type:</span> {house?.roomType}
                  </div>
                  <div>
                    <span className="font-semibold">Gender Allowed:</span> {house?.genderAllowed}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> {house?.location}
                  </div>
                  <div>
                    <span className="font-semibold">Monthly Price:</span> 
                    <span className="text-green-600 font-bold ml-2">Rs. {house?.price}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Available:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      house?.availabilityStatus === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {house?.availabilityStatus}
                    </span>
                  </div>
                </div>
            
                {house?.highlights && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Highlights</h3>
                    <p className="text-gray-600">{house.highlights}</p>
                  </div>
                )}

                {house?.features && house.features.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {house.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visit Date Selection */}
                <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Book a Visit</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Visit Date
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        min={getTomorrowDate()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>
                    <button
                      onClick={handleVisitBooking}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} />
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>

              {/* Short-Term Rental Details */}
              {house?.shortTerm && (
                <div className="bg-white/0 backdrop-blur-sm rounded-lg shadow-xl p-6 ">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="text-orange-600" />
                    Short-Term Rental Details
                  </h2>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        Rs. {house.pricePerNight} <span className="text-sm font-normal text-gray-600">per night</span>
                      </div>
                    </div>

                    {house?.description && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600">{house.description}</p>
                      </div>
                    )}

                    {house?.shortFeatures && house.shortFeatures.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Short-Term Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {house.shortFeatures.map((feature, index) => (
                            <span 
                              key={index}
                              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Book Stay Section */}
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h3 className="font-semibold text-gray-800 mb-3">Book a Stay</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Check-in Date
                            </label>
                            <input
                              type="date"
                              value={stayDates.checkIn}
                              onChange={(e) => setStayDates(prev => ({ ...prev, checkIn: e.target.value }))}
                              min={getTomorrowDate()}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Check-out Date
                            </label>
                            <input
                              type="date"
                              value={stayDates.checkOut}
                              onChange={(e) => setStayDates(prev => ({ ...prev, checkOut: e.target.value }))}
                              min={stayDates.checkIn || getTomorrowDate()}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                        </div>
                        
                        {stayDates.checkIn && stayDates.checkOut && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Total Price:</strong> Rs. {calculateStayPrice()}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Advance Payment: Rs. {calculateAdvancePayment()}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={handleStayBooking}
                          className="w-full bg-orange-400 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Clock size={18} />
                          Book Stay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Owner Information Card */}
              {(house?.owner_name || house?.owner_phone || house?.owner_email) && (
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-green-600" />
                    Owner Information
                  </h2>
                  <div className="space-y-3">
                    {house.owner_name && (
                      <div className="flex items-center gap-3">
                        <User className="text-gray-500" size={18} />
                        <span className="text-gray-700">{house.owner_name}</span>
                      </div>
                    )}
              {house.owner_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="text-gray-500" size={18} />
                        <span className="text-gray-700">{house.owner_phone}</span>
                </div>
              )}
              {house.owner_email && (
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-500" size={18} />
                        <span className="text-gray-700">{house.owner_email}</span>
                </div>
              )}
                  </div>
            </div>
          )}

                            {/* Favorites Card */}
              <div className="bg-white/0 backdrop-blur-sm rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="text-red-600" />
                  Add to Favorites
                </h3>
                
                {/* Favorites Button */}
                <button
                  onClick={toggleFavorite}
                  disabled={favoritesLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isFavorite 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {favoritesLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Heart className={isFavorite ? 'fill-current' : ''} size={18} />
                  )}
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
                      </div>
          </div>

            {/* Reviews Section - Full Width */}
            <div className="mt-8 bg-white/0 backdrop-blur-sm rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="text-yellow-600" />
                     Reviews & Ratings
                    {reviews.length > 0 && (
                      <span className="bg-pink-100 text-pink-600 text-sm font-medium px-3 py-1 rounded-full">
                        {reviews.length} total rating{reviews.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </h2>
                  {averageRating > 0 && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star}
                              className={`text-3xl ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-gray-800">
                            {averageRating.toFixed(1)}
                          </span>
                          <p className="text-sm text-gray-600">
                            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Review Button */}
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-pink-600 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span>📝</span>
                  {showReviewForm ? 'Cancel Review' : 'Write Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Write Your Review</h3>
                  <div className="space-y-4">
                    {/* Rating Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                    <button
                            key={star}
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className={`text-3xl transition-all duration-200 hover:scale-110 ${
                              star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                    </button>
                        ))}
                        <span className="ml-2 text-gray-600 text-sm self-center">
                          ({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})
                        </span>
                  </div>
                  </div>

                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Title *
                      </label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Give your review a title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Detailed Ratings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cleanliness Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cleanliness
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReview(prev => ({ ...prev, cleanliness: star }))}
                              className={`text-xl transition-all duration-200 hover:scale-110 ${
                                star <= newReview.cleanliness ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600 self-center">
                            ({newReview.cleanliness}/5)
                          </span>
                        </div>
                      </div>

                      {/* Location Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReview(prev => ({ ...prev, location: star }))}
                              className={`text-xl transition-all duration-200 hover:scale-110 ${
                                star <= newReview.location ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600 self-center">
                            ({newReview.location}/5)
                          </span>
                        </div>
                      </div>

                      {/* Value Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value for Money
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReview(prev => ({ ...prev, value: star }))}
                              className={`text-xl transition-all duration-200 hover:scale-110 ${
                                star <= newReview.value ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600 self-center">
                            ({newReview.value}/5)
                          </span>
                        </div>
                      </div>

                      {/* Amenities Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReview(prev => ({ ...prev, amenities: star }))}
                              className={`text-xl transition-all duration-200 hover:scale-110 ${
                                star <= newReview.amenities ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600 self-center">
                            ({newReview.amenities}/5)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                        </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with this boarding place..."
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500"
                      />
                      </div>
                      
                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                        onClick={submitReview}
                        disabled={submittingReview || !newReview.title.trim() || !newReview.comment.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                          submittingReview || !newReview.title.trim() || !newReview.comment.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                        }`}
                      >
                        {submittingReview ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            Submit Review
                          </>
                        )}
                        </button>
                        <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setNewReview({ 
                            rating: 5, 
                            title: '',
                            comment: '',
                            cleanliness: 5,
                            location: 5,
                            value: 5,
                            amenities: 5
                          });
                        }}
                        className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-all duration-300"
                      >
                        Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

            {reviews.length > 0 ? (
              <div className="bg-white/0 backdrop-blur-m space-y-6 max-h-96 overflow-y-auto pr-2">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white/0 backdrop-blur-xl rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Header with user info and date */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {(review.userName || review.first_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            {review.userName || `${review.first_name || ''} ${review.last_name || ''}`.trim() || 'Anonymous User'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star}
                              className={`text-lg ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Review title */}
                    {review.title && (
                      <h5 className="font-semibold text-gray-800 mb-3 text-lg">
                        "{review.title}"
                      </h5>
                    )}

                    {/* Detailed ratings */}
                    <div className="grid grid-cols-2 gap-3 mb-1">
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">🧹 Cleanliness</span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                  key={star}
                                  className={`text-xs ${star <= (review.cleanliness || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {review.cleanliness || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">📍 Location</span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                  key={star}
                                  className={`text-xs ${star <= (review.location || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {review.location || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">💰 Value</span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                  key={star}
                                  className={`text-xs ${star <= (review.value || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {review.value || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">🏠 Amenities</span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                  key={star}
                                  className={`text-xs ${star <= (review.amenities || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              {review.amenities || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review comment */}
                    <div className="bg-white/60 rounded-lg p-4 border-l-4 border-pink-800">
                      <p className="text-gray-700 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-dashed border-pink-200">
                <div className="text-8xl mb-6">💌</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No reviews yet!</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  This boarding place is waiting for its first review. Share your experience and help others!
                </p>
                <div className="flex justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-pink-300 rounded-full animate-bounce"></span>
                  <span className="inline-block w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="inline-block w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div style={{
          position: 'fixed',
          top: 95,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(41, 37, 37, 0.52)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          backdropFilter:'blur(80px)',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setIsImageModalOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px'
            }}
          >
            <X size={30} />
          </button>
          
          <img
            src={`http://localhost:5000/uploads/${cleanedImages[currentImageIndex]}`}
            alt={`House ${currentImageIndex}`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
          />
          
          {cleanedImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardingDetail;