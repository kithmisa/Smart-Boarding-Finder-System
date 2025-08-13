import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, Users, Home, CreditCard, Check, Clock, Phone, Mail, User } from 'lucide-react';
import bgHero from '../assets/image.png';


const BoardingDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [stayDates, setStayDates] = useState({ checkIn: '', checkOut: '' });
  const [bookingStatus, setBookingStatus] = useState(''); // 'pending', 'confirmed', 'rejected'
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/houses/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched house data:", data);
          setHouse(data);
        } else {
          console.error("Failed to fetch house:", response.status);
        }
      } catch (err) {
        console.error("Failed to fetch house:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHouse();
    }
  }, [id]);

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
  console.log("cleanedImages:", cleanedImages);

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

    try {
      const response = await fetch('http://localhost:5000/api/bookings/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseId: id,
          visitDate,
          type: 'visit'
        })
      });

      if (response.ok) {
        setBookingStatus('pending');
        alert('Visit request sent! The owner will contact you soon.');
      } else {
        alert('Failed to book visit. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
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

    try {
      const response = await fetch('http://localhost:5000/api/bookings/stay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseId: id,
          checkIn: stayDates.checkIn,
          checkOut: stayDates.checkOut,
          type: 'stay'
        })
      });

      if (response.ok) {
        setBookingStatus('confirmed'); // Simulate owner approval
        alert('Booking confirmed! You can now proceed to payment.');
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

      <div style={{ 
      maxWidth: '1200px', 
      marginTop:'100px',
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Content */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>


       {/* Right Side - Image Gallery */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          {cleanedImages.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ 
                position: 'relative', 
                height: '600px', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                marginTop:'200px'
              }}>
                <img
                  src={`http://localhost:5000/uploads/${cleanedImages[currentImageIndex]}`}
                  alt={`House ${currentImageIndex}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => openImageModal(currentImageIndex)}
                  onError={e => {
                    console.error('Image failed to load:', cleanedImages[currentImageIndex]);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {cleanedImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '14px'
                }}>
                  {currentImageIndex + 1} / {cleanedImages.length}
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              {cleanedImages.length > 1 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginTop: '15px',
                  overflowX: 'auto',
                  paddingBottom: '10px'
                }}>
                  {cleanedImages.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${img}`}
                      alt={`Thumbnail ${index}`}
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: index === currentImageIndex ? '3px solid #007bff' : '2px solid #ddd',
                        flexShrink: 0
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>


        {/* right Side - Property Details */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#333',
            marginTop:'100px'
          }}>
            {house.title}
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            backgroundColor: '#f8f9fa',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="#666" />
              <span><strong>Address:</strong> {house.address}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={20} color="#666" />
              <span><strong>Type:</strong> {house.roomType} / {house.type}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} color="#666" />
              <span><strong>Gender Allowed:</strong> {house.genderAllowed}</span>
            </div>
            
            <div>
              <strong>City:</strong> {house.city}
            </div>
            
            <div>
              <strong>Location:</strong> {house.location}
            </div>
            
            <div>
              <strong>Monthly Price:</strong>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#639bd6ff',
                marginLeft: '10px'
              }}>
                Rs. {house.price?.toLocaleString()}
              </span>
            </div>
            
            {house.features?.length > 0 && (
              <div>
                <strong>Features:</strong>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px', 
                  marginTop: '8px' 
                }}>
                  {house.features.map((feature, index) => (
                    <span key={index} style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {house.highlights && (
              <div>
                <strong>Highlights:</strong> {house.highlights}
              </div>
            )}
          </div>

          {/* Owner Contact Information */}
          {(house.owner_name || house.owner_phone || house.owner_email) && (
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '25px',
              marginBottom: '25px'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '15px',
                color: '#333'
              }}>
                <User size={24} />
                Owner Contact
              </h3>
              
              {house.owner_name && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Name:</strong> {house.owner_name}
                </div>
              )}
              
              {house.owner_phone && (
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#666" />
                  <strong>Phone:</strong> 
                  <a href={`tel:${house.owner_phone}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    {house.owner_phone}
                  </a>
                </div>
              )}
              
              {house.owner_email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#666" />
                  <strong>Email:</strong> 
                  <a href={`mailto:${house.owner_email}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    {house.owner_email}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Long-term Visit Booking Section */}
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #e9ecef',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '20px',
              color: '#333'
            }}>
              <Calendar size={24} />
              Schedule a Visit
            </h3>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500' 
                }}>
                  Select Visit Date:
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={getTomorrowDate()}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <button
                onClick={handleVisitBooking}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Request Visit
              </button>
            </div>
          </div>

          {/* Short Term Booking Section - Moved under property details */}
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #e9ecef',
            borderRadius: '12px',
            padding: '25px'
          }}>
            <h3 style={{ 
              marginBottom: '20px',
              color: '#333'
            }}>
              Short Term Availability
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Short-term Booking:</strong> 
              <span style={{ 
                color: house.shortTerm ? '#28a745' : '#dc3545',
                fontWeight: '500',
                marginLeft: '8px'
              }}>
                {house.shortTerm ? "Available" : "Not Available"}
              </span>
            </div>

            {house.shortTerm && house.pricePerNight > 0 && (
              <>
                <div style={{ 
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: '#007bff',
                    marginBottom: '10px'
                  }}>
                    Rs. {house.pricePerNight?.toLocaleString()} / night
                  </div>
                  
                  {house.shortFeatures?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Short Stay Features:</strong>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px', 
                        marginTop: '8px' 
                      }}>
                        {house.shortFeatures.map((feature, index) => (
                          <span key={index} style={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {house.description && (
                    <div>
                      <strong>Description:</strong>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#666',
                        margin: '8px 0 0 0',
                        lineHeight: '1.4'
                      }}>
                        {house.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Booking Form */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Check-in Date:
                      </label>
                      <input
                        type="date"
                        value={stayDates.checkIn}
                        onChange={(e) => setStayDates({...stayDates, checkIn: e.target.value})}
                        min={getTomorrowDate()}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '2px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Check-out Date:
                      </label>
                      <input
                        type="date"
                        value={stayDates.checkOut}
                        onChange={(e) => setStayDates({...stayDates, checkOut: e.target.value})}
                        min={stayDates.checkIn || getTomorrowDate()}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '2px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  
                  {calculateStayPrice() > 0 && (
                    <div style={{
                      backgroundColor: '#e3f2fd',
                      padding: '15px',
                      borderRadius: '8px',
                      margin: '15px 0',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                        Total: Rs. {calculateStayPrice().toLocaleString()}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc3545' }}>
                        Advance Payment: Rs. {calculateAdvancePayment().toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {Math.ceil((new Date(stayDates.checkOut) - new Date(stayDates.checkIn)) / (1000 * 60 * 60 * 24))} nights
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStayBooking}
                  disabled={bookingStatus === 'pending'}
                  style={{
                    width: '100%',
                    backgroundColor: bookingStatus === 'pending' ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: bookingStatus === 'pending' ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '15px'
                  }}
                >
                  {bookingStatus === 'pending' ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Clock size={16} />
                      Waiting for Confirmation
                    </span>
                  ) : (
                    'Book Stay'
                  )}
                </button>

                {/* Booking Status */}
                {bookingStatus === 'confirmed' && (
                  <div style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={16} />
                    Booking Confirmed! Proceed to payment.
                    <button
                      onClick={() => setShowPayment(true)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        marginLeft: 'auto'
                      }}
                    >
                      <CreditCard size={16} />
                    </button>
                  </div>
                )}

                {bookingStatus === 'paid' && (
                  <div style={{
                    backgroundColor: '#d1ecf1',
                    color: '#0c5460',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={16} />
                    Payment successful! Your booking is confirmed.
                  </div>
                )}

                {/* Payment Modal */}
                {showPayment && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '30px',
                      maxWidth: '400px',
                      width: '90%'
                    }}>
                      <h3 style={{ marginBottom: '20px' }}>Payment</h3>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <strong>Total Amount: Rs. {calculateStayPrice().toLocaleString()}</strong>
                         <br />
                        <strong>Advance Payment (25%): Rs. {calculateAdvancePayment().toLocaleString()}</strong>
                      </div>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px' }}>
                          Payment Method:
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '2px solid #ddd'
                          }}
                        >
                          <option value="card">Credit/Debit Card</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="mobile">Mobile Payment (PickMe Pay/eZ Cash)</option>
                        </select>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setShowPayment(false)}
                          style={{
                            flex: 1,
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePayment}
                          style={{
                            flex: 1,
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

       
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
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