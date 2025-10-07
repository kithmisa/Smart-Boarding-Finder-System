import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaKey, FaUtensils, FaBroom, FaCar, FaCoffee, FaBath,
  FaBolt, FaFaucet, FaDoorOpen, FaChair, FaHome, FaUpload, 
  FaUserFriends, FaTimes, FaEdit, FaTrash, FaCalendarAlt, 
  FaEye, FaCheck, FaClock, FaBan, FaHourglass, FaCheckCircle, 
  FaExclamationTriangle, FaInfoCircle, FaBell, FaUserEdit,
  FaUniversity, FaPlus, FaCog, FaLock, FaDownload,FaCreditCard
} from 'react-icons/fa';
import Navbar from './Navbar';
import BankDetailsModal from './BankDetailsModal'; 
import bgHero from '../assets/image.png';

// BookingsTab Component
const BookingsTab = ({ 
  ownerId, 
  showBookingConfirmModal, 
  setShowBookingConfirmModal, 
  showBookingRejectModal, 
  setShowBookingRejectModal, 
  selectedBooking, 
  setSelectedBooking, 
  confirmData, 
  setConfirmData, 
  rejectReason, 
  setRejectReason 
}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Debug state changes
  useEffect(() => {
    console.log('BookingsTab state updated:', {
      showBookingConfirmModal,
      showBookingRejectModal,
      selectedBooking: selectedBooking?.id
    });
  }, [showBookingConfirmModal, showBookingRejectModal, selectedBooking]);

  useEffect(() => {
    if (ownerId) {
      fetchBookings();
    }
  }, [ownerId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/bookings/stay/owner/${ownerId}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Booking handlers will be in the main component

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglass className="text-yellow-600" />;
      case 'confirmed': return <FaCheckCircle className="text-green-600" />;
      case 'rejected': return <FaBan className="text-red-600" />;
      case 'cancelled': return <FaTimes className="text-gray-600" />;
      case 'completed': return <FaCheck className="text-blue-600" />;
      default: return <FaInfoCircle className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 rounded-lg">
        <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
        <p className="text-gray-500">Short term bookings will appear here when customers book your properties.</p>
      </div>
    );
  }

  // Apply status/payment filters
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'paid') return (b.payment_status === 'paid');
    return b.status === statusFilter; // 'confirmed' | 'pending' | 'rejected'
  });

  const filterButtonClass = (value) =>
    `px-3 py-1 rounded-full text-sm border ${
      statusFilter === value
        ? 'bg-orange-600 text-white border-orange-600'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-sm text-gray-600 mr-2">Filter:</span>
        <button onClick={() => setStatusFilter('all')} className={filterButtonClass('all')}>All</button>
        <button onClick={() => setStatusFilter('paid')} className={filterButtonClass('paid')}>Paid</button>
        <button onClick={() => setStatusFilter('confirmed')} className={filterButtonClass('confirmed')}>Confirmed</button>
        <button onClick={() => setStatusFilter('pending')} className={filterButtonClass('pending')}>Pending</button>
        <button onClick={() => setStatusFilter('rejected')} className={filterButtonClass('rejected')}>Rejected</button>
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No bookings match the selected filter.
        </div>
      )}

      {filteredBookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{booking.house_title}</h3>
              <p className="text-gray-600 text-sm">{booking.house_address}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Booking ID</span>
                <span className="px-2 py-1 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">#{booking.id}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Dates</h4>
              <p className="text-gray-700"><span className="text-gray-500">Check-in:</span> {new Date(booking.check_in_date).toLocaleDateString()}</p>
              <p className="text-gray-700"><span className="text-gray-500">Check-out:</span> {new Date(booking.check_out_date).toLocaleDateString()}</p>
              {booking.check_in_time && (
                <p className="text-gray-700"><span className="text-gray-500">Check-in Time:</span> {booking.check_in_time}</p>
              )}
              {booking.check_out_time && (
                <p className="text-gray-700"><span className="text-gray-500">Check-out Time:</span> {booking.check_out_time}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Guest</h4>
              <p className="text-gray-700"><span className="text-gray-500">Name:</span> {booking.user_name}</p>
              <p className="text-gray-700"><span className="text-gray-500">Email:</span> {booking.user_email}</p>
              <p className="text-gray-700"><span className="text-gray-500">Contact:</span> {booking.user_contact}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Payment Snapshot</h4>
              <p className="text-gray-700"><span className="text-gray-500">Status:</span> {booking.payment_status === 'paid' ? 'Paid' : (booking.payment_status === 'pending' ? 'Pending' : 'Refunded')}</p>
              <p className="text-gray-700"><span className="text-gray-500">Total:</span> Rs. {booking.total_payment}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Payment Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-semibold text-gray-800">Rs. {booking.total_amount}</p>
              </div>
              <div>
                <p className="text-gray-600">Advance Payment</p>
                <p className="font-semibold text-gray-800">Rs. {booking.advance_payment}</p>
              </div>
              <div>
                <p className="text-gray-600">Service Charge</p>
                <p className="font-semibold text-gray-800">Rs. {booking.service_charge}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Payment</p>
                <p className="font-semibold text-orange-600">Rs. {booking.total_payment}</p>
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.payment_status === 'paid' ? '✅ Paid' :
                     booking.payment_status === 'pending' ? '⏳ Pending Payment' :
                     '❌ Refunded'}
                  </span>
                </div>
                
                {booking.payment_status === 'paid' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle size={14} />
                    <span className="text-sm font-medium">Payment Completed</span>
                  </div>
                )}
                
                {booking.status === 'confirmed' && booking.payment_status === 'pending' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <FaClock size={14} />
                    <span className="text-sm font-medium">Awaiting Payment</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {booking.special_requests && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Special Requests
              </h4>
              <p className="text-blue-700 whitespace-pre-wrap">{booking.special_requests}</p>
            </div>
          )}

          {booking.rejection_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <h4 className="font-semibold text-red-800 mb-1">Rejection Reason</h4>
              <p className="text-red-700">{booking.rejection_reason}</p>
            </div>
          )}

          {booking.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log('Confirm button clicked for booking:', booking.id);
                  console.log('Setting selectedBooking to:', booking);
                  console.log('Setting showBookingConfirmModal to true');
                  setSelectedBooking(booking);
                  setShowBookingConfirmModal(true);
                  console.log('State should be updated now');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaCheck className="text-sm" />
                Confirm Booking
              </button>
              <button
                onClick={() => {
                  console.log('Reject button clicked for booking:', booking.id);
                  console.log('Setting selectedBooking to:', booking);
                  console.log('Setting showBookingRejectModal to true');
                  setSelectedBooking(booking);
                  setShowBookingRejectModal(true);
                  console.log('State should be updated now');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaBan className="text-sm" />
                Reject Booking
              </button>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4">
            <p>Booking created: {new Date(booking.created_at).toLocaleString()}</p>
            {booking.confirmed_at && (
              <p>Confirmed: {new Date(booking.confirmed_at).toLocaleString()}</p>
            )}
            {booking.rejected_at && (
              <p>Rejected: {new Date(booking.rejected_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      ))}

      {/* Modals will be rendered at the root level */}
    </div>
  );
};

const HouseDetails = () => {
  const { state } = useLocation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search || '');
  const navigate = useNavigate();
  
  
  console.log("=== DEBUGGING OWNER_ID ===");
  console.log("Full navigation state:", state);
  console.log("state?.ownerData:", state?.ownerData);
  console.log("state?.owner_id:", state?.owner_id);
  console.log("state?.ownerData?.id:", state?.ownerData?.id);
  

  let ownerInfoId = null;
  try {
    const ownerInfoRaw = localStorage.getItem('owner_info');
    if (ownerInfoRaw) {
      const parsed = JSON.parse(ownerInfoRaw);
      ownerInfoId = parsed?.id || parsed?.owner_id || parsed?.ownerId || null;
    }
  } catch {}

  
  let sessionOwnerId = null;
  try {
    sessionOwnerId = sessionStorage.getItem('owner_id') || null;
  } catch {}

 
  const ownerIdFromQuery = searchParams.get('owner_id');

  const rawOwnerId = state?.owner_id || 
                     state?.ownerData?.id || 
                     state?.ownerData?.owner_id ||
                     ownerIdFromQuery ||
                     localStorage.getItem('owner_id') ||
                     sessionOwnerId ||
                     localStorage.getItem('user_owner_id') ||
                     ownerInfoId;

  
  let owner_id = null;
  console.log('🔍 Debug owner_id detection:');
  console.log('   rawOwnerId:', rawOwnerId);
  console.log('   state:', state);
  console.log('   localStorage owner_id:', localStorage.getItem('owner_id'));
  console.log('   sessionStorage owner_id:', (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem('owner_id') : null);
  console.log('   owner_info id fallback:', ownerInfoId);
  console.log('   owner_id from query:', ownerIdFromQuery);
  
  if (rawOwnerId && rawOwnerId !== '' && rawOwnerId !== 'undefined' && rawOwnerId !== 'null') {
    const parsedId = parseInt(rawOwnerId);
    if (!isNaN(parsedId) && parsedId > 0) {
      owner_id = parsedId;
      console.log('✅ Final owner_id:', owner_id);
      try { localStorage.setItem('owner_id', String(owner_id)); } catch {}
    } else {
      console.log('❌ Invalid parsed ID:', parsedId);
    }
  } else {
    console.log('❌ No valid rawOwnerId found');
  }

  console.log("Raw owner_id from state:", rawOwnerId);
  console.log("Final extracted owner_id:", owner_id);
  console.log("Type of owner_id:", typeof owner_id);
  console.log("Is valid owner_id:", owner_id && owner_id > 0);
  console.log("========================");

  const [formData, setFormData] = useState({
    ...state?.ownerData,
    title: '',
    roomType: '',
    genderAllowed: '',
    price: '',
    address: '',
    images: [],
    features: [],
    city: '',
    type: '',
    location: '',
    googleMapsUrl: '',
    highlights: '',
    shortTerm: false,
    pricePerNight: '',
    shortFeatures: [],
    description: '',
    availabilityStatus: 'available',
    availableDate: '',
    owner_id: owner_id || '',
  });

  
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(null);
 
  
  const [activeSection, setActiveSection] = useState(state?.activeSection || 'add-property');
  const [isScrolling, setIsScrolling] = useState(false);

 
  const [statusStats, setStatusStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const [showBankModal, setShowBankModal] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  
  
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpData, setOtpData] = useState({ email: '', name: '', contact: '', nic: '' });
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
 
  const otpInputRef = useRef(null);
  

  useEffect(() => {
    if (showOTPModal && otpInputRef.current) {
      
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [showOTPModal]);

  
  const [editingOwnerProfile, setEditingOwnerProfile] = useState(false);
  const [ownerProfileData, setOwnerProfileData] = useState(state?.ownerData || {});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

 
  const [visitRequests, setVisitRequests] = useState([]);
  

  const [showBookingConfirmModal, setShowBookingConfirmModal] = useState(false);
  const [showBookingRejectModal, setShowBookingRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmData, setConfirmData] = useState({ checkInTime: '', checkOutTime: '', ownerMessage: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loadingVisitRequests, setLoadingVisitRequests] = useState(false);
  
  
  const [waitingListData, setWaitingListData] = useState({});
  const [loadingWaitingList, setLoadingWaitingList] = useState(false);

  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsScrolling(true);
      setActiveSection(sectionId);
      
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

 
  const calculateStatusStats = (listings) => {
    const stats = {
      pending: listings.filter(p => p.status === 'pending').length,
      approved: listings.filter(p => p.status === 'approved').length,
      rejected: listings.filter(p => p.status === 'rejected').length,
      total: listings.length
    };
    setStatusStats(stats);
  };


  const handleEditProperty = (property) => {
    console.log('Editing property:', property);
    
   
    let parsedImages = [];
    try {
      if (Array.isArray(property.images)) {
        parsedImages = property.images;
      } else if (typeof property.images === 'string') {
        parsedImages = JSON.parse(property.images || '[]');
      }
    } catch (error) {
      console.warn('Error parsing images:', error);
      parsedImages = [];
    }
    
    
    setFormData({
      ...property,
      features: Array.isArray(property.features) ? property.features : 
                (typeof property.features === 'string' ? JSON.parse(property.features || '[]') : []),
      shortFeatures: Array.isArray(property.shortFeatures) ? property.shortFeatures : 
                     (typeof property.shortFeatures === 'string' ? JSON.parse(property.shortFeatures || '[]') : []),
      images: parsedImages,
      owner_id: owner_id || property.owner_id
    });
    
    
    setIsEditMode(true);
    setEditingProperty(property);
    
   
    setActiveSection('add-property');
    scrollToSection('add-property');
  };

  
  const resetFormAndExitEdit = () => {
    setFormData({
      title: '',
      roomType: '',
      genderAllowed: '',
      price: '',
      address: '',
      city: '',
      type: '',
      location: '',
      highlights: '',
      features: [],
      shortFeatures: [],
      images: [],
      owner_id: owner_id
    });
    setIsEditMode(false);
    setEditingProperty(null);
  };

  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: FaHourglass,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          label: 'Pending Review',
          description: 'Your property is awaiting admin approval'
        };
      case 'approved':
        return {
          icon: FaCheckCircle,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          label: 'Approved',
          description: 'Your property is live and visible to users'
        };
      case 'rejected':
        return {
          icon: FaExclamationTriangle,
          color: 'bg-red-500',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          label: 'Rejected',
          description: 'Please review and resubmit your property'
        };
      default:
        return {
          icon: FaInfoCircle,
          color: 'bg-gray-500',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  
  const checkBankDetails = async () => {
    if (!owner_id) return false;
    
    try {
      console.log('Checking bank details for owner_id:', owner_id);
      const response = await fetch(`http://localhost:5000/api/owner/${owner_id}/bank-details`);
      
      if (response.ok) {
        const bankDetails = await response.json();
        console.log('Bank details response:', bankDetails);
        const hasBankData = bankDetails && Object.keys(bankDetails).length > 0;
        console.log('Has bank details:', hasBankData);
        setHasBankDetails(hasBankData);
        return hasBankData;
      } else if (response.status === 404) {
        console.log('No bank details found (404)');
        setHasBankDetails(false);
        return false;
      } else {
        console.error('Error checking bank details:', response.status);
        setHasBankDetails(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking bank details:', error);
      setHasBankDetails(false);
      return false;
    }
  };

  
  const handleConfirmBooking = async () => {
    console.log('handleConfirmBooking called');
    console.log('confirmData:', confirmData);
    console.log('selectedBooking:', selectedBooking);
    
    if (!selectedBooking) {
      alert('No booking selected');
      return;
    }

    try {
      console.log('Confirming booking:', selectedBooking.id, confirmData);
      
      const response = await fetch(`http://localhost:5000/api/bookings/stay/${selectedBooking.id}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerMessage: (confirmData.ownerMessage || '').trim()
        })
      });

      const data = await response.json();
      console.log('Confirm response:', data);

      if (response.ok) {
        alert('Booking confirmed successfully!');
        setShowBookingConfirmModal(false);
        setConfirmData({ checkInTime: '', checkOutTime: '', ownerMessage: '' });
        setSelectedBooking(null);
        
        window.location.reload();
      } else {
        alert(`Failed to confirm booking: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Error confirming booking: ' + error.message);
    }
  };

  const handleRejectBooking = async () => {
    console.log('handleRejectBooking called');
    console.log('rejectReason:', rejectReason);
    console.log('selectedBooking:', selectedBooking);
    
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!selectedBooking) {
      alert('No booking selected');
      return;
    }

    try {
      console.log('Rejecting booking:', selectedBooking.id, rejectReason);
      
      const response = await fetch(`http://localhost:5000/api/bookings/stay/${selectedBooking.id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: rejectReason.trim()
        })
      });

      const data = await response.json();
      console.log('Reject response:', data);

      if (response.ok) {
        alert('Booking rejected successfully');
        setShowBookingRejectModal(false);
        setRejectReason('');
        setSelectedBooking(null);
        
        window.location.reload();
      } else {
        alert(`Failed to reject booking: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Error rejecting booking: ' + error.message);
    }
  };

  
  const submitProperty = async (currentOwnerId) => {
    try {
      const data = new FormData();

      data.append('title', formData.title);
      data.append('roomType', formData.roomType);
      data.append('genderAllowed', formData.genderAllowed);
      data.append('price', formData.price);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('type', formData.type);
      data.append('location', formData.location);
      if (formData.googleMapsUrl) {
        data.append('googleMapsUrl', formData.googleMapsUrl);
      }
      data.append('highlights', formData.highlights);
      data.append('shortTerm', formData.shortTerm ? 'true' : 'false');
      data.append('pricePerNight', formData.pricePerNight || '');
      data.append('description', formData.description);
      data.append('features', JSON.stringify(formData.features));
      data.append('shortFeatures', JSON.stringify(formData.shortFeatures));
      data.append('availabilityStatus', formData.availabilityStatus);
      data.append('availableDate', formData.availableDate);
      data.append('owner_id', parseInt(currentOwnerId));

      
      console.log('Submitting property with owner_id:', parseInt(currentOwnerId));
      console.log('Total images to upload:', formData.images.length);
      
      
      formData.images.forEach((file, index) => {
        console.log(`Appending image ${index}:`, file.name, file.type, file.size);
        if (file instanceof File) {
          data.append('images', file);
        }
      });

      const response = await fetch('http://localhost:5000/api/houses', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('❌ Server Response:', errText);
        throw new Error('Failed to submit property');
      }

      const result = await response.json();
      console.log('✅ Property submission success:', result);
      
      alert('✅ Property submitted successfully!\n\n🔍 Your property is now under review by our admin team.\n📧 You will be notified once it\'s approved and live on the platform.');

     
      try {
        const monthlyPriceNum = parseFloat(formData.price) || 0;
        if (monthlyPriceNum > 0) {
          const ownerPayment = {
            type: 'owner_listing_fee',
            house_id: result.houseId,
            title: formData.title,
            address: formData.address,
            monthly_price: monthlyPriceNum,
            fee_percentage: 0.10,
            total_payment: Math.round(monthlyPriceNum * 0.10 * 100) / 100
          };
          try {
            localStorage.setItem('ownerPayment', JSON.stringify(ownerPayment));
            const currentOwnerId = formData.owner_id || owner_id;
            if (currentOwnerId) {
              localStorage.setItem('owner_id', String(currentOwnerId));
            }
          } catch {}
          navigate('/register/house/payment', { state: { ownerPayment } });
        }
      } catch (e) {
        console.warn('Owner payment setup failed:', e);
      }
      
      
      setFormData({
        ...state?.ownerData,
        title: '',
        roomType: '',
        genderAllowed: '',
        price: '',
        address: '',
        images: [],
        features: [],
        city: '',
        type: '',
        location: '',
        highlights: '',
        shortTerm: false,
        pricePerNight: '',
        shortFeatures: [],
        description: '',
        availabilityStatus: 'available',
        availableDate: '',
        owner_id: owner_id || '',
      });
      
      
      fetchMyListings();
      
    } catch (error) {
      console.error('❌ Property submission error:', error);
      alert('❌ Failed to submit property. Please try again.');
    }
  };

  
  const updateProperty = async (currentOwnerId) => {
    try {
      
      console.log('Updating property ID:', editingProperty.id);
      console.log('Updating property with owner_id:', parseInt(currentOwnerId));
      console.log('Form data:', formData);
      
      
      const updateData = {
        title: formData.title,
        roomType: formData.roomType,
        genderAllowed: formData.genderAllowed,
        price: formData.price,
        address: formData.address,
        city: formData.city,
        type: formData.type,
        location: formData.location,
        googleMapsUrl: formData.googleMapsUrl || '',
        highlights: formData.highlights,
        shortTerm: formData.shortTerm,
        pricePerNight: formData.pricePerNight || '',
        description: formData.description || '',
        availabilityStatus: formData.availabilityStatus,
        availableDate: formData.availableDate
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(`http://localhost:5000/api/houses/${editingProperty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('❌ Server Response:', errText);
        console.error('❌ Response Status:', response.status);
        throw new Error(`Failed to update property: ${response.status} ${errText}`);
      }

      const result = await response.json();
      console.log('✅ Property update success:', result);
      
      
      if (formData.features.length > 0 || formData.shortFeatures.length > 0) {
        console.log('Note: Features update may require separate API call');
      }
      
      
      const hasNewImages = formData.images.some(img => img instanceof File);
      if (hasNewImages) {
        console.log('Note: Image updates may require separate API call');
        
      }
      
      alert('✅ Property updated successfully!');
      
      
      resetFormAndExitEdit();
      
      
      fetchMyListings();
      setActiveSection('my-listings');
      scrollToSection('my-listings');
      
    } catch (error) {
      console.error('❌ Property update error:', error);
      alert(`❌ Failed to update property: ${error.message}`);
    }
  };

  // ✅ FIXED: Improved bank details submission with better state management
  const handleBankDetailsSubmit = async (bankData) => {
    if (!owner_id) {
      alert('❌ Owner ID is missing. Please try again.');
      return;
    }

    try {
      // ✅ Validate bankData
      if (!bankData || Object.keys(bankData).length === 0) {
        alert('❌ Bank details are required. Please fill out all fields.');
        return;
      }

      const requiredFields = ['accountHolderName', 'bankName', 'accountNumber', 'accountType', 'branchName'];
      const missingFields = requiredFields.filter(field => !bankData[field] || bankData[field].trim() === '');
      
      if (missingFields.length > 0) {
        alert(`❌ Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Submitting bank details for owner_id:', owner_id);
      console.log('Bank data payload:', bankData);

      const response = await fetch(`http://localhost:5000/api/owner/${owner_id}/bank-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...bankData,
          owner_id: owner_id // Ensure owner_id is included in the request body
        }),
      });

      console.log('Bank details response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Bank details saved successfully:', result);
        
        // ✅ FIXED: Immediately update the state and close modal
        setHasBankDetails(true);
        setShowBankModal(false);
        
        // ✅ NEW: Check if this is an update or new creation
        console.log('Bank details action:', result.action);
        
        if (result.action === 'created') {
          // First time creating bank details - proceed with property submission
          console.log('🆕 First time bank details - proceeding with property submission');
          alert('✅ Bank details saved successfully! Now submitting your property...');
          
          setTimeout(async () => {
            console.log('Proceeding with property submission after bank details save');
            const currentOwnerId = formData.owner_id || owner_id;
            await submitProperty(currentOwnerId);
          }, 100);
        } else if (result.action === 'updated') {
          // Updating existing bank details - just show success message
          console.log('🔄 Bank details updated - no property submission needed');
          alert('✅ Bank details updated successfully!');
        } else {
          // Fallback - show generic success message
          console.log('❓ Unknown action - showing generic success message');
          alert('✅ Bank details saved successfully!');
        }
        
      } else {
        // Handle error responses
        const responseText = await response.text();
        console.error('❌ Bank details save failed:', response.status, responseText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || 'Unknown server error';
        } catch {
          errorMessage = responseText || `Server error: ${response.status}`;
        }
        
        if (response.status === 404) {
          alert('❌ Owner not found. Please contact support.');
        } else if (response.status === 400) {
          alert(`❌ Invalid data: ${errorMessage}`);
        } else {
          alert(`❌ Failed to save bank details: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('❌ Network error saving bank details:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('❌ Network error. Please check if the server is running on http://localhost:5000');
      } else {
        alert(`❌ Failed to save bank details: ${error.message}`);
      }
    }
  };

  // ✅ NEW: Detect scroll position and update active section
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return; // Don't update during programmatic scroll
      
      const addPropertyForm = document.getElementById('add-property-form');
      const myListingsSection = document.getElementById('my-listings-section');
      
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      if (addPropertyForm && myListingsSection) {
        const addPropertyTop = addPropertyForm.offsetTop;
        const listingsTop = myListingsSection.offsetTop;
        
        if (scrollPosition < listingsTop) {
          setActiveSection('add-property');
        } else {
          setActiveSection('my-listings');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  // ✅ Add useEffect to update owner_id if it changes
  useEffect(() => {
    if (owner_id && formData.owner_id !== owner_id) {
      setFormData(prev => ({
        ...prev,
        owner_id: owner_id
      }));
    }
  }, [owner_id, formData.owner_id]);

  // ✅ Fetch owner's listings on component mount
  useEffect(() => {
    if (owner_id) {
      fetchMyListings();
      fetchVisitRequests();
      fetchNotifications();
      checkBankDetails();
    }
  }, [owner_id]);

  // ✅ Fetch waiting list data when listings are loaded
  useEffect(() => {
    if (myListings.length > 0) {
      fetchWaitingListData();
    }
  }, [myListings]);

  // ✅ Fetch owner's listings function - UPDATED to calculate stats
  const fetchMyListings = async () => {
    if (!owner_id) return;
    
    setLoadingListings(true);
    try {
      const response = await fetch(`http://localhost:5000/api/houses/owner/${owner_id}`);
      if (response.ok) {
        const listings = await response.json();
        setMyListings(listings);
        calculateStatusStats(listings); // ✅ NEW: Calculate statistics
        console.log('✅ Fetched listings:', listings);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  // ✅ Fetch visit requests for owner
  const fetchVisitRequests = async () => {
    console.log('📋 fetchVisitRequests called, owner_id:', owner_id);
    if (!owner_id) {
      console.log('❌ No owner_id found, skipping visit requests fetch');
      return;
    }
    
    setLoadingVisitRequests(true);
    try {
      console.log('🔄 Fetching visit requests for owner:', owner_id);
      const response = await fetch(`http://localhost:5000/api/visit-requests/owner/${owner_id}`);
      console.log('📡 Visit requests response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Visit requests data received:', data);
        console.log('📊 Number of visit requests:', data.visitRequests?.length || 0);
        setVisitRequests(data.visitRequests || []);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch visit requests:', response.status, errorText);
      }
    } catch (error) {
      console.error('💥 Error fetching visit requests:', error);
    } finally {
      setLoadingVisitRequests(false);
    }
  };

  // ✅ Fetch notifications for owner
  const fetchNotifications = async () => {
    if (!owner_id) return;
    
    try {
      console.log('Fetching notifications for owner:', owner_id);
      const response = await fetch(`http://localhost:5000/api/notifications/owner/${owner_id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // ✅ Fetch waiting list data for all properties
  const fetchWaitingListData = async () => {
    if (!owner_id || !myListings.length) return;
    
    setLoadingWaitingList(true);
    try {
      const waitingListPromises = myListings.map(async (house) => {
        try {
          const response = await fetch(`http://localhost:5000/api/houses/${house.id}/waiting-list`);
          if (response.ok) {
            const data = await response.json();
            return { houseId: house.id, waitingList: data.waitingList || [] };
          }
          return { houseId: house.id, waitingList: [] };
        } catch (error) {
          console.error(`Error fetching waiting list for house ${house.id}:`, error);
          return { houseId: house.id, waitingList: [] };
        }
      });

      const results = await Promise.all(waitingListPromises);
      const waitingListMap = {};
      results.forEach(result => {
        waitingListMap[result.houseId] = result.waitingList;
      });
      
      setWaitingListData(waitingListMap);
      console.log('✅ Fetched waiting list data:', waitingListMap);
    } catch (error) {
      console.error('Error fetching waiting list data:', error);
    } finally {
      setLoadingWaitingList(false);
    }
  };

  // Add this right after the fetchMyListings function
  useEffect(() => {
    console.log('Owner ID for fetching:', owner_id);
    console.log('MyListings state:', myListings);
    console.log('LoadingListings state:', loadingListings);
  }, [owner_id, myListings, loadingListings]);

  const handleFeatureToggle = (label, type = 'features') => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(label)
        ? prev[type].filter((f) => f !== label)
        : [...prev[type], label],
    }));
  };

  // ✅ Enhanced image upload handling
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log("New files selected:", files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      if (!isValidType) {
        alert(`"${file.name}" is not a valid image file.`);
        return false;
      }
      return true;
    });

    console.log("Valid files:", validFiles);
    
    setFormData((prev) => {
      const newImages = [...prev.images, ...validFiles];
      console.log("Updated images array:", newImages);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  // ✅ Remove image function
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ FIXED: Simplified handleSubmit function
  const handleSubmit = async () => {
    const {
      title, roomType, genderAllowed, price, address,
      city, type, location,
    } = formData;

    // Required field validation
    if (
      !title || !roomType || !genderAllowed || !price || !address ||
      !city || !type || !location
    ) {
      alert('❌ Please fill out all required fields.');
      return;
    }

    // ✅ Image validation - require at least 3 images for new properties, at least 1 for edits
    const minImages = isEditMode ? 1 : 3;
    if (formData.images.length < minImages) {
      alert(`❌ Please upload at least ${minImages} image${minImages > 1 ? 's' : ''} to proceed.`);
      return;
    }

    // ✅ Better owner_id validation
    const currentOwnerId = formData.owner_id || owner_id;
    console.log('Checking owner_id:', currentOwnerId, 'Type:', typeof currentOwnerId);
    
    if (!currentOwnerId || currentOwnerId === '' || currentOwnerId === 'undefined' || currentOwnerId === 'null') {
      alert('❌ Owner ID is missing. Please register/login first and try again.');
      console.error('Missing owner_id. Current value:', currentOwnerId);
      navigate('/register/owner');
      return;
    }

    // ✅ FIXED: Check bank details dynamically before each submission (skip for edits)
    if (!isEditMode) {
      console.log('Current hasBankDetails state:', hasBankDetails);
      const currentBankStatus = await checkBankDetails();
      console.log('Fresh bank status check:', currentBankStatus);

      if (!currentBankStatus) {
        console.log('Bank details missing, showing modal');
        if (!owner_id) {
          console.error('❌ Cannot open bank modal: owner_id is missing');
          alert('Owner ID is missing. Please refresh the page and try again.');
          return;
        }
        alert('⚠️ Bank details are required before submitting properties. Please add your bank details first.');
        setShowBankModal(true);
        return;
      }
    }

    // ✅ Proceed with property submission or update
    if (isEditMode) {
      await updateProperty(currentOwnerId);
    } else {
      await submitProperty(currentOwnerId);
    }
  };

  // ✅ Delete property function
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/houses/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Property deleted successfully!');
        fetchMyListings(); // Refresh the listings
      } else {
        alert('❌ Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('❌ Error deleting property');
    }
  };

  // ✅ Update availability status
  const handleUpdateAvailability = async (propertyId, status, availableDate = null) => {
    try {
      const response = await fetch(`http://localhost:5000/api/houses/${propertyId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availabilityStatus: status,
          availableDate: availableDate,
        }),
      });

      if (response.ok) {
        alert('✅ Availability updated successfully!');
        fetchMyListings(); // Refresh the listings
        setShowAvailabilityModal(null);
      } else {
        alert('❌ Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('❌ Error updating availability');
    }
  };

  // ✅ Update booking status
  const handleUpdateBookingStatus = async (propertyId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/houses/${propertyId}/booking-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingStatus: status,
        }),
      });

      if (response.ok) {
        alert(`✅ Booking status updated to ${status}!`);
        fetchMyListings(); // Refresh the listings
      } else {
        alert('❌ Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('❌ Error updating booking status');
    }
  };

  // ============================
  // Visit Request Handlers & Modal State
  // ============================
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [confirmingRequestId, setConfirmingRequestId] = useState(null);
  const [rejectingRequestId, setRejectingRequestId] = useState(null);
  const [confirmFormData, setConfirmFormData] = useState({
    confirmedDate: '',
    confirmedTime: '',
    ownerResponse: ''
  });
  const [rejectFormData, setRejectFormData] = useState({
    rejectionReason: '',
    suggestedDate: '',
    suggestedTime: '',
    additionalMessage: ''
  });

  const handleConfirmVisit = async (requestId) => {
    setConfirmingRequestId(requestId);
    setShowConfirmModal(true);
  };

  const submitConfirmation = async () => {
    const { confirmedDate, confirmedTime, ownerResponse } = confirmFormData;
    
    if (!confirmedDate || !confirmedTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/visit-requests/${confirmingRequestId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmedDate,
          confirmedTime,
          ownerResponse
        }),
      });

      if (response.ok) {
        alert('✅ Visit request confirmed successfully! Email notification sent to user.');
        setShowConfirmModal(false);
        setConfirmFormData({ confirmedDate: '', confirmedTime: '', ownerResponse: '' });
        fetchVisitRequests(); // Refresh visit requests
        fetchNotifications(); // Refresh notifications
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to confirm visit request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error confirming visit request:', error);
      alert('❌ Error confirming visit request');
    }
  };

  const handleRejectVisit = async (requestId) => {
    setRejectingRequestId(requestId);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    const { rejectionReason, suggestedDate, suggestedTime, additionalMessage } = rejectFormData;
    
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    // Build the owner response message
    let ownerResponse = rejectionReason;
    if (suggestedDate && suggestedTime) {
      ownerResponse += `\n\nSuggested alternative: ${new Date(suggestedDate).toLocaleDateString()} at ${suggestedTime}`;
    }
    if (additionalMessage.trim()) {
      ownerResponse += `\n\nAdditional message: ${additionalMessage}`;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/visit-requests/${rejectingRequestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerResponse,
          suggestedDate: suggestedDate || null,
          suggestedTime: suggestedTime || null
        }),
      });

      if (response.ok) {
        alert('✅ Visit request rejected successfully! Email notification sent to user with alternative suggestions.');
        setShowRejectModal(false);
        setRejectFormData({ rejectionReason: '', suggestedDate: '', suggestedTime: '', additionalMessage: '' });
        fetchVisitRequests(); // Refresh visit requests
        fetchNotifications(); // Refresh notifications
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to reject visit request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting visit request:', error);
      alert('❌ Error rejecting visit request');
    }
  };

  const featureOptions = [
    { icon: FaKey, label: 'Key Access' },
    { icon: FaUtensils, label: 'Meals Provided' },
    { icon: FaBroom, label: 'Cleaning Service' },
    { icon: FaCar, label: 'Parking Available' },
    { icon: FaCoffee, label: 'Free Coffee' },
    { icon: FaBath, label: 'Private Bathroom' },
    { icon: FaBolt, label: 'Electricity Included' },
    { icon: FaFaucet, label: 'Water Supply' },
    { icon: FaDoorOpen, label: 'Private Entrance' },
    { icon: FaChair, label: 'Furnished' },
    { icon: FaUserFriends, label: 'Shared Room' },
  ];

  // ✅ Edit Profile handler functions
  const handleSaveOwnerProfile = async () => {
    try {
      // Debug: Log what we're sending
      console.log('=== FRONTEND PROFILE UPDATE DEBUG ===');
      console.log('Owner ID:', owner_id);
      console.log('Owner Profile Data:', ownerProfileData);
      console.log('State Owner Data:', state?.ownerData);
      console.log('=====================================');

      // Validate required fields before sending
      const { name, email, contact, nic } = ownerProfileData;
      if (!name?.trim() || !email?.trim() || !contact?.trim() || !nic?.trim()) {
        const missingFields = [];
        if (!name?.trim()) missingFields.push('Name');
        if (!email?.trim()) missingFields.push('Email');
        if (!contact?.trim()) missingFields.push('Contact');
        if (!nic?.trim()) missingFields.push('NIC');
        
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Check if email is changing
      const isEmailChanging = email.trim() !== (state?.ownerData?.email || '');
      
      if (isEmailChanging) {
        // Email is changing, need OTP verification
        try {
          const result = await handleEmailChangeWithOTP(name, email, contact, nic);
          if (result) {
            // OTP verification was successful, result contains the updated owner data
            await handleProfileUpdateSuccess(result);
          }
        } catch (error) {
          console.error('OTP verification failed:', error);
          // Error is already handled in the modal
        }
      } else {
        // Email unchanged, update directly
        await updateProfileDirectly(name, email, contact, nic);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Function to handle email change with OTP verification
  const handleEmailChangeWithOTP = async (name, email, contact, nic) => {
    try {
      // Step 1: Send OTP to new email
      const otpResponse = await fetch(`http://localhost:5000/api/owner/${owner_id}/send-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      const otpData = await otpResponse.json();
      
      if (otpData.emailVerified) {
        // Email unchanged, update directly
        await updateProfileDirectly(name, email, contact, nic);
        return;
      }

      // Step 2: Show OTP modal instead of prompt
      setOtpData({ email: email.trim(), name, contact, nic });
      setOtpInput('');
      setOtpError('');
      setShowOTPModal(true);
      
      // Wait for modal to be closed with OTP
      return new Promise((resolve, reject) => {
        // Store the resolve/reject for later use
        window.otpModalPromise = { resolve, reject };
        console.log('🔐 OTP Modal Promise created, waiting for user input...');
      });

    } catch (error) {
      console.error('Error in email OTP flow:', error);
      alert(`Email verification failed: ${error.message}`);
    }
  };

  // Function to update profile directly (when email unchanged)
  const updateProfileDirectly = async (name, email, contact, nic) => {
    const response = await fetch(`http://localhost:5000/api/owner/${owner_id}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        contact: contact.trim(),
        nic: nic.trim()
      }),
    });

    if (response.ok) {
      const updatedOwner = await response.json();
      await handleProfileUpdateSuccess(updatedOwner);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
  };

  // Function to handle successful profile update
  const handleProfileUpdateSuccess = async (updatedOwner) => {
    // Update the local state with new data
    setOwnerProfileData(updatedOwner.updated_fields);
    
    // Update the global navigation state
    if (state?.ownerData) {
      const updatedState = {
        ...state,
        ownerData: {
          ...state.ownerData,
          ...updatedOwner.updated_fields
        }
      };
      // Update the location state
      navigate(location.pathname, { state: updatedState, replace: true });
    }
    
    setEditingOwnerProfile(false);
    alert('Profile updated successfully!');
  };

  const handleDownloadData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/owner/${owner_id}/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `owner_data_${owner_id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Data downloaded successfully!');
      } else {
        throw new Error('Failed to download data');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data. Please try again.');
    }
  };

 
  return (
    <>
      <Navbar />
      <div
        className="relative flex-grow px-8 pt-32 pb-16 text-white"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pt-32 pb-20 px-6 bg-white/50 min-h-screen">

        
          {/* Status Overview Dashboard */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="backdrop-blur-sm rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHome className="text-blue-600" />
                Property Status Overview
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Properties</p>
                      <p className="text-2xl font-bold text-blue-800">{statusStats.total}</p>
                    </div>
                    <FaHome className="text-blue-500 text-2xl" />
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Pending Review</p>
                      <p className="text-2xl font-bold text-yellow-800">{statusStats.pending}</p>
                    </div>
                    <FaHourglass className="text-yellow-500 text-2xl" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Approved</p>
                      <p className="text-2xl font-bold text-green-800">{statusStats.approved}</p>
                    </div>
                    <FaCheckCircle className="text-green-500 text-2xl" />
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Rejected</p>
                      <p className="text-2xl font-bold text-red-800">{statusStats.rejected}</p>
                    </div>
                    <FaExclamationTriangle className="text-red-500 text-2xl" />
                  </div>
                </div>
              </div>

              {/* Status explanations */}
              <div className="bg-blue-0 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <FaInfoCircle />
                  Property Approval Process
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Submitted:</strong> Your property is sent for admin review</p>
                  <p><strong>Under Review:</strong> Admin is checking details and images</p>
                  <p><strong>Approved:</strong> Property goes live and is visible to users</p>
                  <p><strong>Rejected:</strong> Please review feedback and resubmit</p>
                </div>
              </div>
            </div>
          </div>


          {/* ✅ NAVIGATION TABS */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex justify-center">
              <div className=" backdrop-blur-sm rounded-3xl shadow-2xl p-4 flex flex-wrap gap-4 justify-center">

                {/* Add Property Tab */}
                <button
                  onClick={() => setActiveSection('add-property')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'add-property' 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-xl scale-105 transform -rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 hover:text-white hover:scale-105 hover:shadow-xl hover:rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'add-property' ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-white/20'}`}>
                    <FaHome className={`text-lg ${activeSection === 'add-property' ? 'text-white' : 'text-blue-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">{isEditMode ? 'Edit Property' : 'Add Property'}</span>
                  {activeSection === 'add-property' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* My Listings Tab */}
                <button
                  onClick={() => setActiveSection('my-listings')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'my-listings' 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl scale-105 transform rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 hover:text-white hover:scale-105 hover:shadow-xl hover:-rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'my-listings' ? 'bg-white/20' : 'bg-green-100 group-hover:bg-white/20'}`}>
                    <FaEye className={`text-lg ${activeSection === 'my-listings' ? 'text-white' : 'text-green-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">My Listings</span>
                  {activeSection === 'my-listings' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Visit Requests Tab */}
                <button
                  onClick={() => setActiveSection('visit-requests')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'visit-requests' 
                      ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-xl scale-105 transform rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-500 hover:text-white hover:scale-105 hover:shadow-xl hover:-rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'visit-requests' ? 'bg-white/20' : 'bg-purple-100 group-hover:bg-white/20'}`}>
                    <FaCalendarAlt className={`text-lg ${activeSection === 'visit-requests' ? 'text-white' : 'text-purple-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">Visit Requests</span>
                  {activeSection === 'visit-requests' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Short Term Bookings Tab */}
                <button
                  onClick={() => setActiveSection('short-term-bookings')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'short-term-bookings' 
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-xl scale-105 transform -rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 hover:text-white hover:scale-105 hover:shadow-xl hover:rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'short-term-bookings' ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-white/20'}`}>
                    <FaClock className={`text-lg ${activeSection === 'short-term-bookings' ? 'text-white' : 'text-orange-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">Bookings</span>
                  {activeSection === 'short-term-bookings' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Notifications Tab */}
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'notifications' 
                      ? 'bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-xl scale-105 transform rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-pink-400 hover:to-red-500 hover:text-white hover:scale-105 hover:shadow-xl hover:-rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'notifications' ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-white/20'}`}>
                    <FaBell className={`text-lg ${activeSection === 'notifications' ? 'text-white' : 'text-pink-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">Notifications</span>
                  {activeSection === 'notifications' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Edit Profile Tab */}
                <button
                  onClick={() => setActiveSection('edit-profile')}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'edit-profile' 
                      ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-xl scale-105 transform -rotate-1' 
                      : 'bg-white/40 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-500 hover:text-white hover:scale-105 hover:shadow-xl hover:rotate-1 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeSection === 'edit-profile' ? 'bg-white/20' : 'bg-indigo-100 group-hover:bg-white/20'}`}>
                    <FaEdit className={`text-lg ${activeSection === 'edit-profile' ? 'text-white' : 'text-indigo-600 group-hover:text-white'}`} />
                  </div>
                  <span className="font-bold">Edit Profile</span>
                  {activeSection === 'edit-profile' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-400 rounded-full animate-pulse"></div>
                  )}
                </button>

              </div>
            </div>
          </div>


          

          {/* ADD PROPERTY FORM */}
          {activeSection === 'add-property' && (
            <div id="add-property-form" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 scroll-mt-32">
              {/* Visual indicator for active section */}
              <div className="col-span-full mb-4">
                <div className="bg-blue-0 border-b-2 border-green-500 text-gray-700 p-4 rounded-r-lg">
                  <p className="font-semibold flex items-center gap-2">
                    <FaHome /> {isEditMode ? 'Edit Property Form' : 'Add New Property Form'}
                  </p>
                  <p className="text-sm mt-1">
                    {isEditMode 
                      ? 'Update the details of your property below.' 
                      : 'Fill out the form below to add a new property to your listings.'}
                  </p>
                  <p className="text-xs mt-2 bg-blue-50 p-2 rounded">
                    <strong>Note:</strong> New properties require admin approval before going live
                  </p>
                </div>
              </div>

              {/* Left Side - Main Form */}
              <div>
                <h2 className="text-xl text-black font-bold flex items-center gap-2">
                  <FaHome /> House Details
                </h2>
                <div className="h-1 w-20 bg-green-600 mt-1 mb-4 rounded-full" />
                <div className="text-black space-y-4 mt-4">
                  <input
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                  <div className="flex gap-4">
                    Room Type
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="roomType"
                        value="private"
                        checked={formData.roomType === 'private'}
                        onChange={handleChange}
                      />{' '}
                      Private
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="roomType"
                        value="shared"
                        checked={formData.roomType === 'shared'}
                        onChange={handleChange}
                      />{' '}
                      Shared
                    </label>
                  </div>

                  <div className="mt-4">
                    Gender Allowed:
                    <div className="flex space-x-6">
                      {['Girls', 'Boys', 'Anyone'].map((gender) => (
                        <label key={gender} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="genderAllowed"
                            value={gender}
                            checked={formData.genderAllowed === gender}
                            onChange={handleChange}
                            className="mr-1"
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />

                  {/* Enhanced Image Upload Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        Images ({formData.images.length}/∞) 
                        <span className="text-red-500 ml-1">*At least 3 required</span>
                      </p>
                      {formData.images.length >= 3 && (
                        <span className="text-green-600 text-sm font-semibold">✓ Minimum met</span>
                      )}
                    </div>
                    
                    <div
                      className={`border-2 border-dashed px-4 py-6 rounded-lg text-gray-500 flex flex-col items-center cursor-pointer transition-colors ${
                        formData.images.length < 3 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      onClick={() => document.getElementById('imageUpload').click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files);
                        handleImageUpload({ target: { files } });
                      }}
                    >
                      <FaUpload className="text-blue-500 text-3xl mb-2" />
                      <span>Drag & drop or click to upload images</span>
                      <span className="text-xs mt-1">
                        {formData.images.length < 3 
                          ? `Need ${3 - formData.images.length} more image(s)`
                          : 'You can add more images'
                        }
                      </span>
                    </div>

                    <input
                      type="file"
                      id="imageUpload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Enhanced Image Preview with Remove Option */}
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Selected Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {formData.images.map((img, idx) => {
                            // Handle both File objects (new uploads) and URL strings (existing images)
                            let imageSrc = '';
                            let isFileObject = false;
                            
                            if (img instanceof File || img instanceof Blob) {
                              // New uploaded file
                              try {
                                imageSrc = URL.createObjectURL(img);
                                isFileObject = true;
                              } catch (error) {
                                console.error('Error creating object URL for file:', error, img);
                                return (
                                  <div key={idx} className="relative group bg-gray-200 w-full h-32 rounded border flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Invalid File</span>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(idx)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    >
                                      <FaTimes size={12} />
                                    </button>
                                  </div>
                                );
                              }
                            } else if (typeof img === 'string' && img.trim() !== '') {
                              // Existing image filename from database - construct full URL
                              imageSrc = img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`;
                              isFileObject = false;
                            } else {
                              // Invalid image data
                              console.warn('Invalid image data at index:', idx, img);
                              return null;
                            }
                            
                            return (
                              <div key={idx} className="relative group">
                                <img
                                  src={imageSrc}
                                  alt={`preview-${idx}`}
                                  className="w-full h-32 object-cover rounded border"
                                  onLoad={() => {
                                    // Clean up object URL if it was created for a file
                                    if (isFileObject) {
                                      setTimeout(() => URL.revokeObjectURL(imageSrc), 100);
                                    }
                                  }}
                                  onError={(e) => {
                                    console.error('Image failed to load:', imageSrc);
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                {/* Fallback for failed images */}
                                <div className="hidden w-full h-32 bg-gray-200 rounded border flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Image Failed</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTimes size={12} />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                  {idx + 1}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Select House Features:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {featureOptions.map(({ icon: Icon, label }, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(label)}
                            onChange={() => handleFeatureToggle(label)}
                          />
                          <Icon /> {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option value="">Select City</option>
                    <option value="Matara">Matara</option>
                  </select>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option value="">Select Type</option>
                    <option value="House">House</option>
                    <option value="Room">Room</option>
                    <option value="Annex">Annex</option>
                  </select>

                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option value="">Select Location</option>
                    <option value="Matara Town">Matara</option>
                    <option value="Pallimulla">Pallimulla</option>
                    <option value="Welewaththa">Welewaththa</option>
                    <option value="Maddewaththa">Maddewaththa</option>
                    <option value="Eliyakanda">Eliyakanda</option>
                    <option value="Janaraja Mw">Janaraja Mw</option>
                    <option value="Rassandeniya">Rassandeniya</option>
                    <option value="Gandarawaththa">Gandarawaththa</option>
                    <option value="S K Town">S K Town</option>
                    <option value="Devinuwara">Devinuwara</option>
                  </select>

                  <input
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={handleChange}
                    placeholder="Google Maps link (Share > Copy link)"
                    className="w-full border px-4 py-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = (formData.googleMapsUrl || '').trim() || 'https://www.google.com/maps';
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Open Google Maps
                  </button>

                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Highlights"
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </div>

              {/* Right Side - Short Term Rental */}
              <div>
                <h2 className="text-lg text-black font-bold mb-2">Short-Term Availability</h2>
                <label className="flex items-center gap-2 mb-4 text-black">
                  Does your property support short-term rentals?
                  <input
                    type="checkbox"
                    name="shortTerm"
                    checked={formData.shortTerm}
                    onChange={handleChange}
                  />
                </label>

                {formData.shortTerm && (
                  <div className="space-y-4">
                    <input
                      name="pricePerNight"
                      placeholder="Price per night"
                      value={formData.pricePerNight}
                      onChange={handleChange}
                      className="w-full border px-4 py-2 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <h3 className="font-semibold text-gray-900">Short Term Features:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                      {[
                        'Meals Provided',
                        'On-site Parking',
                        'Private Bathroom',
                        'Free Coffee',
                        'Visitors Allowed',
                        'Cleaning Services',
                      ].map((label, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-gray-700">
                          <input
                            type="checkbox"
                            checked={formData.shortFeatures.includes(label)}
                            onChange={() => handleFeatureToggle(label, 'shortFeatures')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          {label}
                        </label>
                      ))}
                    </div>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Description"
                      className="w-full border px-4 py-2 rounded text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <div className="col-span-full text-center mb-16">
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isEditMode ? formData.images.length < 1 : formData.images.length < 3}
                    className={`px-8 py-3 rounded font-bold transition-all ${
                      (isEditMode ? formData.images.length < 1 : formData.images.length < 3)
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isEditMode 
                      ? (formData.images.length < 1 
                          ? `Upload ${1 - formData.images.length} More Image(s) to Update`
                          : 'Update Property')
                      : (formData.images.length < 3 
                          ? `Upload ${3 - formData.images.length} More Image(s) to Submit`
                          : 'Submit Property for Review')
                    }
                  </button>
                  
                  {isEditMode && (
                    <button
                      onClick={resetFormAndExitEdit}
                      className="px-8 py-3 rounded font-bold transition-all bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isEditMode ? 'Update your property details' : 'Properties are reviewed within 24 hours'}
                </p>
              </div>
            </div>
          )}

          {/* MY LISTINGS SECTION */}
          {activeSection === 'my-listings' && (
            <div id="my-listings-section" className="max-w-7xl mx-auto scroll-mt-32">
              {/* Visual indicator for active section */}
              <div className="mb-6">
                <div className="bg-green-0 border-b-2 border-green-500 text-gray-700 p-4 rounded-r-lg">
                  <p className="font-semibold flex items-center gap-2">
                    <FaEye /> Your Property Listings
                  </p>
                  <p className="text-sm mt-1">
                    Manage your {myListings.length} properties - edit details, update availability, or remove listings.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-black font-bold flex items-center gap-2">
                  <FaHome /> My Property Listings
                </h2>
                <div className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                  Total Properties: {myListings.length}
                </div>
              </div>
              <div className="h-1 w-32 bg-green-600 mb-6 rounded-full" />

              {loadingListings ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading your listings...</div>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-12 bg-white/80 rounded-lg">
                  <FaHome className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Listed Yet</h3>
                  <p className="text-gray-500">Add your first property using the form above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((property) => {
                    const statusInfo = getStatusInfo(property.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Property Image */}
                        <div className="relative h-48">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={`http://localhost:5000/uploads/${property.images[0]}`}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = bgHero; // Fallback image
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FaHome className="text-4xl text-gray-400" />
                            </div>
                          )}
                          
                          {/* Status Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {/* Approval Status Badge */}
                            <span className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 ${statusInfo.color} text-white`}>
                              <StatusIcon size={10} />
                              {statusInfo.label}
                            </span>
                            
                            {/* Availability Status Badge - Simplified */}
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              property.availabilityStatus === 'available' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-red-600 text-white'
                            }`}>
                              {property.availabilityStatus === 'available' ? 'Available' : 'Unavailable'}
                            </span>

                            {/* Owner Payment Status Badge */}
                            {(() => {
                              try {
                                const paid = localStorage.getItem(`owner_fee_paid_${property.id}`) === 'true';
                                return (
                                  <span className={`px-2 py-1 text-xs font-semibold rounded ${paid ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white'}`}>
                                    {paid ? 'Listing Fee Paid' : 'Listing Fee Pending'}
                                  </span>
                                );
                              } catch {
                                return null;
                              }
                            })()}
                          </div>

                          <div className="absolute top-2 right-2">
                            <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {property.imageCount || 0} photos
                            </span>
                          </div>

                          {/* Approval status overlay */}
                          {(property.status === 'pending' || property.status === 'rejected') && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <div className={`${statusInfo.bgColor} ${statusInfo.textColor} px-4 py-2 rounded-lg text-center`}>
                                <StatusIcon className="mx-auto text-2xl mb-2" />
                                <p className="font-semibold text-sm">{statusInfo.label}</p>
                                <p className="text-xs">{statusInfo.description}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 truncate">
                            {property.title}
                          </h3>
                          
                          {/* Status explanation */}
                          <div className={`${statusInfo.bgColor} ${statusInfo.textColor} p-2 rounded-lg mb-3 text-sm`}>
                            <div className="flex items-center gap-2">
                              <StatusIcon />
                              <span className="font-medium">{statusInfo.label}</span>
                            </div>
                            <p className="text-xs mt-1">{statusInfo.description}</p>
                            {property.status === 'rejected' && property.rejectionReason && (
                              <p className="text-xs mt-1 font-medium">
                                Reason: {property.rejectionReason}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center justify-between">
                              <span>{property.type}</span>
                              <span>{property.genderAllowed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{property.roomType}</span>
                              <span className="font-semibold text-green-600">
                                Rs. {property.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span className="truncate">{property.location}, {property.city}</span>
                            </div>
                            {property.shortTerm && (
                              <div className="text-blue-600">
                                🌙 Short-term: Rs. {property.pricePerNight}/night
                              </div>
                            )}
                          </div>

                          {/* Action Buttons - Updated based on approval status */}
                          <div className="flex flex-wrap gap-2">
                            {/* Edit Button - Always available */}
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <FaEdit /> Edit
                            </button>

                            {/* Delete Button - Always available */}
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <FaTrash /> Delete
                            </button>

                            {/* Pay Listing Fee Button - Show when pending */}
                            {(() => {
                              try {
                                const paid = localStorage.getItem(`owner_fee_paid_${property.id}`) === 'true';
                                if (!paid) {
                                  return (
                                    <button
                                      onClick={() => {
                                        const monthlyPriceNum = parseFloat(property.price) || 0;
                                        const ownerPayment = {
                                          type: 'owner_listing_fee',
                                          house_id: property.id,
                                          title: property.title,
                                          address: property.address,
                                          monthly_price: monthlyPriceNum,
                                          fee_percentage: 0.10,
                                          total_payment: Math.round(monthlyPriceNum * 0.10 * 100) / 100
                                        };
                                        try { localStorage.setItem('ownerPayment', JSON.stringify(ownerPayment)); } catch {}
                                        navigate('/register/house/payment', { state: { ownerPayment } });
                                      }}
                                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-1"
                                    >
                                      <FaCreditCard /> Pay Listing Fee
                                    </button>
                                  );
                                }
                              } catch {}
                              return null;
                            })()}
                          </div>

                          {/* Availability Management - Only for approved properties */}
                          {property.status === 'approved' && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex flex-wrap gap-2">
                                {/* Availability Status Buttons - Simplified */}
                                {property.availabilityStatus !== 'available' && (
                                  <button
                                    onClick={() => handleUpdateAvailability(property.id, 'available')}
                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <FaCheck /> Set Available
                                  </button>
                                )}

                                {property.availabilityStatus !== 'unavailable' && (
                                  <button
                                    onClick={() => setShowAvailabilityModal(property.id)}
                                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <FaBan /> Set Unavailable
                                  </button>
                                )}
                              </div>

                              {/* Available Date Display */}
                              {property.availableDate && (
                                <div className="text-xs text-gray-500 mt-2">
                                  📅 Available from: {new Date(property.availableDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Pending/Rejected status messages */}
                          {property.status === 'pending' && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                                ⏳ This property is under admin review. Availability management will be enabled once approved.
                              </p>
                            </div>
                          )}

                          {property.status === 'rejected' && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                                ❌ This property was rejected. Please edit the details and resubmit.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* AVAILABILITY MODAL */}
          {showAvailabilityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Set Property as Unavailable</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select when this property will be available again:
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From Date:
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.availableDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableDate: e.target.value }))}
                    className="w-full border px-3 py-2 rounded text-gray-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (formData.availableDate) {
                        handleUpdateAvailability(showAvailabilityModal, 'unavailable', formData.availableDate);
                        setShowAvailabilityModal(null);
                      } else {
                        alert('Please select a date when the property will be available again.');
                      }
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium"
                  >
                    Set Unavailable
                  </button>
                  <button
                    onClick={() => setShowAvailabilityModal(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* VISIT REQUESTS SECTION */}
          {activeSection === 'visit-requests' && (
            <div id="visit-requests-section" className="max-w-7xl mx-auto mb-16 scroll-mt-32">
              <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaCalendarAlt className="text-purple-600" />
                  Visit Requests
                </h2>
                
                {loadingVisitRequests ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading visit requests...</p>
                  </div>
                ) : visitRequests.length > 0 ? (
                  <div className="space-y-4">
                    {visitRequests.map((request) => (
                      <div key={request.id} className="bg-white/0 rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{request.boarding_title}</h3>
                            <p className="text-gray-600">Requested by {request.first_name} {request.last_name}</p>
                            <p className="text-gray-500 text-sm">{request.email}</p>
                            {request.phone && <p className="text-gray-500 text-sm">{request.phone}</p>}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="font-medium text-gray-700">Requested Date:</span>
                            <span className="ml-2 text-gray-900">{new Date(request.requested_date).toLocaleDateString()}</span>
                          </div>
                          {request.requested_time && (
                            <div>
                              <span className="font-medium text-gray-700">Requested Time:</span>
                              <span className="ml-2 text-gray-900">{request.requested_time}</span>
                            </div>
                          )}
                          {request.confirmed_date && (
                            <div>
                              <span className="font-medium text-gray-700">Confirmed Date:</span>
                              <span className="ml-2 text-green-600 font-medium">{new Date(request.confirmed_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {request.confirmed_time && (
                            <div>
                              <span className="font-medium text-gray-700">Confirmed Time:</span>
                              <span className="ml-2 text-green-600 font-medium">{request.confirmed_time}</span>
                            </div>
                          )}
                        </div>
                        
                        {request.message && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-700">Message:</span>
                            <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded-lg">{request.message}</p>
                          </div>
                        )}
                        
                        {request.owner_response && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-700">Your Response:</span>
                            <p className="mt-1 text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">{request.owner_response}</p>
                          </div>
                        )}
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-3 mt-4">
                            <button 
                              onClick={() => handleConfirmVisit(request.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                              <FaCheck /> Confirm
                            </button>
                            <button 
                              onClick={() => handleRejectVisit(request.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                              <FaBan /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/80 rounded-lg">
                    <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Visit Requests Yet</h3>
                    <p className="text-gray-500">Visit requests from potential tenants will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <div id="notifications-section" className="max-w-7xl mx-auto mb-16 scroll-mt-32">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaBell className="text-pink-600" />
                  Waiting List Notifications
                </h2>
                
                {loadingWaitingList ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading waiting list data...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myListings.length === 0 ? (
                      <div className="text-center py-12 bg-white/80 rounded-lg">
                        <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties</h3>
                        <p className="text-gray-500">You need to add properties first to see waiting list notifications.</p>
                      </div>
                    ) : (
                      myListings.map((house) => {
                        const waitingList = waitingListData[house.id] || [];
                        const totalWaiting = waitingList.length;
                        const waitingCount = waitingList.filter(item => item.status === 'waiting').length;
                        const notifiedCount = waitingList.filter(item => item.status === 'notified').length;
                        
                        return (
                          <div key={house.id} className="bg-white/60 rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{house.title}</h3>
                                <p className="text-sm text-gray-600">{house.location}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">{totalWaiting}</div>
                                  <div className="text-xs text-gray-500">Total</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl font-bold text-yellow-600">{waitingCount}</div>
                                  <div className="text-xs text-gray-500">Waiting</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xl font-bold text-blue-600">{notifiedCount}</div>
                                  <div className="text-xs text-gray-500">Notified</div>
                                </div>
                              </div>
                            </div>
                            
                            {totalWaiting > 0 ? (
                              <div className="space-y-3">
                                <h4 className="font-medium text-gray-700 mb-3">Users on Waiting List:</h4>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                  {waitingList.map((user, index) => (
                                    <div key={user.waiting_id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-800">
                                              {user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              user.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                              user.status === 'notified' ? 'bg-blue-100 text-blue-700' :
                                              'bg-gray-100 text-gray-700'
                                            }`}>
                                              {user.status}
                                            </span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            <div>📧 {user.email}</div>
                                            {user.phone && <div>📞 {user.phone}</div>}
                                            {user.message && <div className="mt-1 text-gray-500 italic">"{user.message}"</div>}
                                          </div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                          <div>Joined: {new Date(user.joined_at).toLocaleDateString()}</div>
                                          {user.notified_at && (
                                            <div>Notified: {new Date(user.notified_at).toLocaleDateString()}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <FaBell className="mx-auto text-3xl text-gray-300 mb-2" />
                                <p>No users on waiting list for this property</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDIT PROFILE SECTION */}
          {activeSection === 'edit-profile' && (
            <div id="edit-profile-section" className="max-w-7xl mx-auto mb-16 scroll-mt-32">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaEdit className="text-indigo-600" />
                  Edit Profile
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Owner Information Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-full">
                          <FaUserEdit className="text-white" />
                        </div>
                        Owner Information
                      </h3>
                      <button
                        onClick={() => setEditingOwnerProfile(true)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                    </div>
                    
                    {editingOwnerProfile ? (
                      /* Owner Edit Form */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={ownerProfileData.name || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, name: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={ownerProfileData.email || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, email: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                          <input
                            type="tel"
                            value={ownerProfileData.contact || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, contact: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Enter your contact number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">National ID (NIC)</label>
                          <input
                            type="text"
                            value={ownerProfileData.nic || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, nic: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-900 placeholder-gray-500"
                            placeholder="NIC Number"
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">NIC cannot be changed for security reasons</p>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={handleSaveOwnerProfile}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <FaCheck />
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingOwnerProfile(false);
                              setOwnerProfileData(state?.ownerData || {});
                            }}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Owner Display */
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Full Name</p>
                              <p className="text-lg font-semibold text-gray-800">{state?.ownerData?.name || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Email</p>
                              <p className="text-lg text-gray-800">{state?.ownerData?.email || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Contact</p>
                              <p className="text-lg text-gray-800">{state?.ownerData?.contact || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">NIC</p>
                              <p className="text-lg text-gray-800">{state?.ownerData?.nic || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-full">
                              <FaCalendarAlt className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Member Since</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {state?.ownerData?.created_at 
                                  ? new Date(state.ownerData.created_at).toLocaleDateString()
                                  : 'Unknown'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bank Details Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-full">
                          <FaUniversity className="text-white" />
                        </div>
                        Bank Details
                      </h3>
                                              <button
                          onClick={() => {
                            if (!owner_id) {
                              console.error('❌ Cannot open bank modal: owner_id is missing');
                              alert('Owner ID is missing. Please refresh the page and try again.');
                              return;
                            }
                            console.log('✅ Opening bank modal with owner_id:', owner_id);
                            setShowBankModal(true);
                          }}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaPlus size={14} />
                          {hasBankDetails ? 'Update' : 'Add'} Bank Details
                        </button>
                    </div>
                    
                    {hasBankDetails ? (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">Bank Account Information</h4>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              ✓ Verified
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Account Holder</p>
                              <p className="text-lg font-semibold text-gray-800">John Doe</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Bank</p>
                              <p className="text-lg text-gray-800">Commercial Bank</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Account Type</p>
                              <p className="text-lg text-gray-800">Savings Account</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Account Number</p>
                              <p className="text-lg text-gray-800">****1234</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-full">
                              <FaCheck className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Payment Status</p>
                              <p className="text-lg font-semibold text-green-700">Ready to receive payments</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <FaExclamationTriangle className="text-yellow-600 text-2xl" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">No Bank Details Added</h4>
                        <p className="text-gray-600 mb-4">Add your bank details to receive payments from bookings</p>
                        <button
                          onClick={() => {
                            if (!owner_id) {
                              console.error('❌ Cannot open bank modal: owner_id is missing');
                              alert('Owner ID is missing. Please refresh the page and try again.');
                              return;
                            }
                            console.log('✅ Opening bank modal with owner_id:', owner_id);
                            setShowBankModal(true);
                          }}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                          <FaPlus />
                          Add Bank Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Account Management Section */}
                <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 shadow-lg border border-red-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-full">
                      <FaCog className="text-white" />
                    </div>
                    Account Management
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Change Password */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <FaLock className="text-blue-600 text-xl" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Change Password</h4>
                        <p className="text-gray-600 text-sm mb-4">Update your account password for security</p>
                        <button
                          onClick={() => setShowChangePasswordModal(true)}
                          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                    
                    {/* Download Data */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <FaDownload className="text-green-600 text-xl" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Download Data</h4>
                        <p className="text-gray-600 text-sm mb-4">Download all your account data and property information</p>
                        <button
                          onClick={handleDownloadData}
                          className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Download Data
                        </button>
                      </div>
                    </div>
                    
                    {/* Delete Account */}
                    <div className="bg-white rounded-lg p-6 border border-red-200 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <FaTrash className="text-red-600 text-xl" />
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Delete Account</h4>
                        <p className="text-gray-600 text-sm mb-4">Permanently delete your account and all data</p>
                        <button
                          onClick={() => setShowDeleteAccountModal(true)}
                          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Important Notice */}
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-yellow-600 text-lg mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-yellow-800 mb-1">Important Account Information</h5>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• Ensure your contact information is always up to date</li>
                          <li>• Bank details are required to receive booking payments</li>
                          <li>• Account deletion is permanent and cannot be undone</li>
                          <li>• Contact support if you need assistance with any account issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHORT TERM BOOKINGS SECTION */}
          {activeSection === 'short-term-bookings' && (
            <div id="bookings-section" className="max-w-7xl mx-auto mb-16 scroll-mt-32">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaClock className="text-orange-600" />
                  Short Term Bookings
                </h2>
                <BookingsTab 
                  ownerId={owner_id}
                  showBookingConfirmModal={showBookingConfirmModal}
                  setShowBookingConfirmModal={setShowBookingConfirmModal}
                  showBookingRejectModal={showBookingRejectModal}
                  setShowBookingRejectModal={setShowBookingRejectModal}
                  selectedBooking={selectedBooking}
                  setSelectedBooking={setSelectedBooking}
                  confirmData={confirmData}
                  setConfirmData={setConfirmData}
                  rejectReason={rejectReason}
                  setRejectReason={setRejectReason}
                />
              </div>
            </div>
          )}

        </div>
      </div>
      
      <BankDetailsModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onSubmit={handleBankDetailsSubmit}
        ownerData={{
          name: state?.ownerData?.name || formData.name || '',
          email: state?.ownerData?.email || formData.email || '',
          contact: state?.ownerData?.contact || formData.contact || '',
          nic: state?.ownerData?.nic || formData.nic || '',
          id: owner_id || state?.ownerData?.id || state?.owner_id
        }}
      />

      {/* ✅ NEW: Cute OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-bounceIn">
            {/* Header with cute icon */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-t-3xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
                  <span className="text-3xl animate-pulse">🔐</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Email Verification</h3>
                <p className="text-white text-opacity-90 text-sm">
                  We sent a 6-digit code to
                </p>
                <p className="text-white font-semibold text-lg">
                  {otpData.email}
                </p>
              </div>
            </div>

            {/* OTP Input Section */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Please enter the verification code
                </p>
                
                <p className="text-sm text-gray-500 mb-4">
                  💡 Type your 6-digit code below
                </p>
                
                {/* Cute OTP Input */}
                <div className="flex justify-center space-x-3 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-300 transform hover:scale-110 ${
                        index < otpInput.length
                          ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-lg shadow-purple-200'
                          : index === otpInput.length
                          ? 'border-purple-300 bg-purple-25 text-purple-400 animate-pulse'
                          : 'border-gray-300 bg-gray-50 text-gray-400'
                      }`}
                    >
                      {otpInput[index] || (index === otpInput.length ? '|' : '')}
                    </div>
                  ))}
                </div>

                {/* Hidden Input for typing */}
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpInput(value);
                    setOtpError('');
                  }}
                  className="absolute opacity-0 pointer-events-none"
                  autoFocus
                  placeholder="Enter 6-digit code"
                />
                
                {/* Visible Input Field */}
                <div className="relative mb-4">
                  <input
                    ref={otpInputRef}
                    type="text"
                    value={otpInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtpInput(value);
                      setOtpError('');
                    }}
                    onKeyDown={(e) => {
                      // Allow only numbers and backspace
                      if (!/[\d\b]/.test(e.key) && !['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-center text-lg font-mono bg-white shadow-sm transition-all duration-200 hover:border-purple-400"
                    placeholder="Type 6-digit code here"
                    autoFocus
                    maxLength={6}
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-purple-400 text-lg">🔢</span>
                  </div>
                </div>

                {/* Error Message */}
                {otpError && (
                  <div className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl p-3 animate-bounce">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg">❌</span>
                      <span className="font-medium">{otpError}</span>
                    </div>
                  </div>
                )}

                {/* Resend OTP Button */}
                <button
                  onClick={async () => {
                    try {
                      setIsVerifying(true);
                      const otpResponse = await fetch(`http://localhost:5000/api/owner/${owner_id}/send-email-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpData.email }),
                      });
                      
                      if (otpResponse.ok) {
                        setOtpError('');
                        alert('🔄 New OTP sent! Check your email.');
                      } else {
                        const errorData = await otpResponse.json();
                        setOtpError(errorData.error || 'Failed to resend OTP');
                      }
                    } catch (error) {
                      setOtpError('Failed to resend OTP');
                    } finally {
                      setIsVerifying(false);
                    }
                  }}
                  disabled={isVerifying}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isVerifying ? '🔄 Sending...' : '📧 Resend Code'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowOTPModal(false);
                    if (window.otpModalPromise) {
                      window.otpModalPromise.reject(new Error('OTP verification cancelled'));
                      window.otpModalPromise = null;
                    }
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  ❌ Cancel
                </button>
                
                <button
                  onClick={async () => {
                    if (otpInput.length !== 6) {
                      setOtpError('Please enter a 6-digit code');
                      return;
                    }

                    try {
                      setIsVerifying(true);
                      setOtpError('');

                      // Verify OTP and update profile
                      const verifyResponse = await fetch(`http://localhost:5000/api/owner/${owner_id}/verify-email-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: otpData.name,
                          email: otpData.email,
                          contact: otpData.contact,
                          nic: otpData.nic,
                          otp: otpInput
                        }),
                      });

                      if (verifyResponse.ok) {
                        const updatedOwner = await verifyResponse.json();
                        
                        // Show success animation before closing
                        setOtpError('');
                        setOtpInput('✅ Verified!');
                        
                        // Wait a moment to show success, then close
                        setTimeout(() => {
                          setShowOTPModal(false);
                          
                          // Resolve the promise with success
                          if (window.otpModalPromise) {
                            window.otpModalPromise.resolve(updatedOwner);
                            window.otpModalPromise = null;
                          }
                        }, 1000);
                      } else {
                        const errorData = await verifyResponse.json();
                        setOtpError(errorData.error || 'Failed to verify OTP');
                      }
                    } catch (error) {
                      setOtpError('Verification failed. Please try again.');
                    } finally {
                      setIsVerifying(false);
                    }
                  }}
                  disabled={otpInput.length !== 6 || isVerifying}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? '🔄 Verifying...' : '✅ Verify & Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 Cute Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4 ">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all mt-14">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Visit Request</h3>
              <p className="text-gray-600">Select your preferred date and time</p>
            </div>

            <div className="space-y-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Select Date
                </label>
                <input
                  type="date"
                  value={confirmFormData.confirmedDate}
                  onChange={(e) => setConfirmFormData(prev => ({...prev, confirmedDate: e.target.value}))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors bg-white"
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⏰ Select Time
                </label>
                <input
                  type="time"
                  value={confirmFormData.confirmedTime}
                  onChange={(e) => setConfirmFormData(prev => ({...prev, confirmedTime: e.target.value}))}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors bg-white"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💬 Message to Visitor (Optional)
                </label>
                <textarea
                  value={confirmFormData.ownerResponse}
                  onChange={(e) => setConfirmFormData(prev => ({...prev, ownerResponse: e.target.value}))}
                  placeholder="Write a friendly message to the visitor..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors bg-white resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmFormData({ confirmedDate: '', confirmedTime: '', ownerResponse: '' });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitConfirmation}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                ✨ Confirm Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 Cute Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 max-w-lg w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto mt-14">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">😔</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Decline Visit Request</h3>
              <p className="text-gray-600">Provide feedback and suggest alternative dates</p>
            </div>

            <div className="space-y-6">
              {/* Rejection Reason */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ❌ Reason for Declining *
                </label>
                <select
                  value={rejectFormData.rejectionReason}
                  onChange={(e) => setRejectFormData(prev => ({...prev, rejectionReason: e.target.value}))}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select a reason...</option>
                  <option value="Requested date/time not available">Requested date/time not available</option>
                  <option value="Property already booked for that period">Property already booked for that period</option>
                  <option value="Maintenance/renovation scheduled">Maintenance/renovation scheduled</option>
                  <option value="Personal schedule conflict">Personal schedule conflict</option>
                  <option value="Property not ready for viewing">Property not ready for viewing</option>
                  <option value="Need more information from visitor">Need more information from visitor</option>
                  <option value="Other">Other (please specify below)</option>
                </select>
              </div>

              {/* Alternative Date Suggestion */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  💡 Suggest Alternative Visit Time
                </h4>
                <p className="text-sm text-blue-700 mb-3">Help the visitor by suggesting when they can visit instead</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      📅 Alternative Date
                    </label>
                    <input
                      type="date"
                      value={rejectFormData.suggestedDate}
                      onChange={(e) => setRejectFormData(prev => ({...prev, suggestedDate: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      ⏰ Alternative Time
                    </label>
                    <input
                      type="time"
                      value={rejectFormData.suggestedTime}
                      onChange={(e) => setRejectFormData(prev => ({...prev, suggestedTime: e.target.value}))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-400 focus:outline-none transition-colors bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💬 Additional Message (Optional)
                </label>
                <textarea
                  value={rejectFormData.additionalMessage}
                  onChange={(e) => setRejectFormData(prev => ({...prev, additionalMessage: e.target.value}))}
                  placeholder="Any additional information or apologies you'd like to share..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors bg-white resize-none"
                />
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                <p className="text-xs text-yellow-800 flex items-center gap-1">
                  <span>💡</span>
                  <strong>Tip:</strong> Providing alternative dates and friendly communication helps maintain good relationships with potential tenants.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectFormData({ rejectionReason: '', suggestedDate: '', suggestedTime: '', additionalMessage: '' });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                📝 Send Decline Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirm Modal */}
      {showBookingConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to the guest (optional)</label>
                <textarea
                  value={confirmData.ownerMessage}
                  onChange={(e) => setConfirmData({ ...confirmData, ownerMessage: e.target.value })}
                  placeholder="Write a short note to the guest (e.g., check-in instructions, parking info)."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBookingConfirmModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Reject Modal */}
      {showBookingRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Booking</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason, and optionally suggest another date/time or next steps."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-28 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRejectBooking}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setShowBookingRejectModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HouseDetails;