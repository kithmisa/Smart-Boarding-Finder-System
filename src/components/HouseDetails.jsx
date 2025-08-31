import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaKey, FaUtensils, FaBroom, FaCar, FaCoffee, FaBath,
  FaBolt, FaFaucet, FaDoorOpen, FaChair, FaHome, FaUpload, 
  FaUserFriends, FaTimes, FaEdit, FaTrash, FaCalendarAlt, 
  FaEye, FaCheck, FaClock, FaBan, FaHourglass, FaCheckCircle, 
  FaExclamationTriangle, FaInfoCircle, FaBell, FaUserEdit,
  FaUniversity, FaPlus, FaCog, FaLock, FaDownload
} from 'react-icons/fa';
import Navbar from './Navbar';
import BankDetailsModal from './BankDetailsModal'; 
import bgHero from '../assets/image.png';

const HouseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // ✅ Comprehensive debugging
  console.log("=== DEBUGGING OWNER_ID ===");
  console.log("Full navigation state:", state);
  console.log("state?.ownerData:", state?.ownerData);
  console.log("state?.owner_id:", state?.owner_id);
  console.log("state?.ownerData?.id:", state?.ownerData?.id);
  
  // ✅ Try multiple ways to get owner_id and convert to number
  const rawOwnerId = state?.owner_id || 
                     state?.ownerData?.id || 
                     state?.ownerData?.owner_id ||
                     localStorage.getItem('owner_id');

  // ✅ Convert to number and validate
  let owner_id = null;
  console.log('🔍 Debug owner_id detection:');
  console.log('   rawOwnerId:', rawOwnerId);
  console.log('   state:', state);
  console.log('   localStorage owner_id:', localStorage.getItem('owner_id'));
  
  if (rawOwnerId && rawOwnerId !== '' && rawOwnerId !== 'undefined' && rawOwnerId !== 'null') {
    const parsedId = parseInt(rawOwnerId);
    if (!isNaN(parsedId) && parsedId > 0) {
      owner_id = parsedId;
      console.log('✅ Final owner_id:', owner_id);
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
    highlights: '',
    shortTerm: false,
    pricePerNight: '',
    shortFeatures: [],
    description: '',
    availabilityStatus: 'available',
    availableDate: '',
    owner_id: owner_id || '',
  });

  // ✅ State for listings management
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(null);
 
  // ✅ NEW: Smooth scrolling and navigation states
  const [activeSection, setActiveSection] = useState('add-property');
  const [isScrolling, setIsScrolling] = useState(false);

  // ✅ NEW: Status statistics for dashboard
  const [statusStats, setStatusStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const [showBankModal, setShowBankModal] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  // ✅ Edit Profile state
  const [editingOwnerProfile, setEditingOwnerProfile] = useState(false);
  const [ownerProfileData, setOwnerProfileData] = useState(state?.ownerData || {});
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // ✅ Visit requests and notifications state
  const [visitRequests, setVisitRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingVisitRequests, setLoadingVisitRequests] = useState(false);

  // ✅ NEW: Smooth scrolling function
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
      
      // Remove scrolling indicator after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // ✅ NEW: Calculate status statistics
  const calculateStatusStats = (listings) => {
    const stats = {
      pending: listings.filter(p => p.status === 'pending').length,
      approved: listings.filter(p => p.status === 'approved').length,
      rejected: listings.filter(p => p.status === 'rejected').length,
      total: listings.length
    };
    setStatusStats(stats);
  };

  // ✅ NEW: Get status display info
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

  // ✅ FIXED: Improved bank details check function
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

  // ✅ NEW: Separate property submission logic
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
      data.append('highlights', formData.highlights);
      data.append('shortTerm', formData.shortTerm ? 'true' : 'false');
      data.append('pricePerNight', formData.pricePerNight || '');
      data.append('description', formData.description);
      data.append('features', JSON.stringify(formData.features));
      data.append('shortFeatures', JSON.stringify(formData.shortFeatures));
      data.append('availabilityStatus', formData.availabilityStatus);
      data.append('availableDate', formData.availableDate);
      data.append('owner_id', parseInt(currentOwnerId));

      // ✅ Debug: Log what we're sending
      console.log('Submitting property with owner_id:', parseInt(currentOwnerId));
      console.log('Total images to upload:', formData.images.length);
      
      // ✅ Properly append each image file
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
      
      // ✅ Reset form and refresh listings
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
      
      // ✅ Refresh the listings to show the new property
      fetchMyListings();
      
    } catch (error) {
      console.error('❌ Property submission error:', error);
      alert('❌ Failed to submit property. Please try again.');
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
        
        alert('✅ Bank details saved successfully! Now submitting your property...');
        
        // ✅ FIXED: Wait a moment for state updates, then proceed with property submission
        setTimeout(async () => {
          console.log('Proceeding with property submission after bank details save');
          // Get the current owner_id and submit property directly
          const currentOwnerId = formData.owner_id || owner_id;
          await submitProperty(currentOwnerId);
        }, 100); // Short delay to ensure state updates
        
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

    // ✅ Image validation - require at least 3 images
    if (formData.images.length < 3) {
      alert('❌ Please upload at least 3 images to proceed.');
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

    // ✅ FIXED: Check bank details dynamically before each submission
    console.log('Current hasBankDetails state:', hasBankDetails);
    const currentBankStatus = await checkBankDetails();
    console.log('Fresh bank status check:', currentBankStatus);

    if (!currentBankStatus) {
      console.log('Bank details missing, showing modal');
      alert('⚠️ Bank details are required before submitting properties. Please add your bank details first.');
      setShowBankModal(true);
      return;
    }

    // ✅ Proceed with property submission
    await submitProperty(currentOwnerId);
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
      const response = await fetch(`http://localhost:5000/api/owner/${owner_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerProfileData),
      });

      if (response.ok) {
        const updatedOwner = await response.json();
        setEditingOwnerProfile(false);
        alert('Profile updated successfully!');
        // Update the global state if needed
        // window.location.reload(); // Or update the state more elegantly
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
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
                  <span className="font-bold">Add Property</span>
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
                    <FaHome /> Add New Property Form
                  </p>
                  <p className="text-sm mt-1">Fill out the form below to add a new property to your listings.</p>
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
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className="w-full h-32 object-cover rounded border"
                              />
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
                          ))}
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
                      className="w-full border px-4 py-2 rounded"
                    />

                    <h3 className="font-semibold text-black">Short Term Features:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-black">
                      {[
                        'Meals Provided',
                        'On-site Parking',
                        'Private Bathroom',
                        'Free Coffee',
                        'Visitors Allowed',
                        'Cleaning Services',
                      ].map((label, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.shortFeatures.includes(label)}
                            onChange={() => handleFeatureToggle(label, 'shortFeatures')}
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
                      className="w-full border px-4 py-4 rounded"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <div className="col-span-full text-center mb-16">
                <button
                  onClick={handleSubmit}
                  disabled={formData.images.length < 3}
                  className={`px-8 py-3 rounded font-bold transition-all ${
                    formData.images.length < 3
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {formData.images.length < 3 
                    ? `Upload ${3 - formData.images.length} More Image(s) to Submit`
                    : 'Submit Property for Review'
                  }
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Properties are reviewed within 24 hours
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
                            
                            {/* Availability Status Badge */}
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              property.availabilityStatus === 'available' 
                                ? 'bg-green-600 text-white' 
                                : property.availabilityStatus === 'occupied'
                                ? 'bg-red-600 text-white'
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {property.availabilityStatus}
                            </span>
                            
                            {property.bookingStatus && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                property.bookingStatus === 'confirmed' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-orange-500 text-white'
                              }`}>
                                {property.bookingStatus}
                              </span>
                            )}
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
                              onClick={() => setEditingProperty(property)}
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
                          </div>

                          {/* Availability Management - Only for approved properties */}
                          {property.status === 'approved' && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex flex-wrap gap-2">
                                {/* Availability Status Buttons */}
                                {property.availabilityStatus !== 'available' && (
                                  <button
                                    onClick={() => handleUpdateAvailability(property.id, 'available')}
                                    className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <FaCheck /> Set Available
                                  </button>
                                )}
                                
                                {property.availabilityStatus !== 'occupied' && (
                                  <button
                                    onClick={() => handleUpdateAvailability(property.id, 'occupied')}
                                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <FaBan /> Set Occupied
                                  </button>
                                )}

                                {property.availabilityStatus !== 'unavailable' && (
                                  <button
                                    onClick={() => setShowAvailabilityModal(property.id)}
                                    className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <FaCalendarAlt /> Set Unavailable
                                  </button>
                                )}
                              </div>

                              {/* Booking Status Management */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <button
                                  onClick={() => handleUpdateBookingStatus(property.id, 'pending')}
                                  className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded flex items-center gap-1"
                                >
                                  <FaClock /> Pending
                                </button>
                                
                                <button
                                  onClick={() => handleUpdateBookingStatus(property.id, 'confirmed')}
                                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                                >
                                  <FaCheck /> Confirm
                                </button>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Set Unavailable Date</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select when this property will be available again:
                </p>
                
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdateAvailability(showAvailabilityModal, 'unavailable', e.target.value);
                    }
                  }}
                  className="w-full border px-3 py-2 rounded mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateAvailability(showAvailabilityModal, 'unavailable')}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Set Unavailable (No Date)
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

          {/* EDIT PROPERTY MODAL */}
          {editingProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Edit Property</h3>
                  <button
                    onClick={() => setEditingProperty(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editingProperty.title || ''}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      title: e.target.value
                    })}
                    className="w-full border px-3 py-2 rounded"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Price"
                      value={editingProperty.price || ''}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        price: e.target.value
                      })}
                      className="border px-3 py-2 rounded"
                    />

                    <select
                      value={editingProperty.genderAllowed || ''}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        genderAllowed: e.target.value
                      })}
                      className="border px-3 py-2 rounded"
                    >
                      <option value="">Gender Allowed</option>
                      <option value="Girls">Girls</option>
                      <option value="Boys">Boys</option>
                      <option value="Anyone">Anyone</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Address"
                    value={editingProperty.address || ''}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      address: e.target.value
                    })}
                    rows="2"
                    className="w-full border px-3 py-2 rounded"
                  />

                  <textarea
                    placeholder="Highlights"
                    value={editingProperty.highlights || ''}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      highlights: e.target.value
                    })}
                    rows="3"
                    className="w-full border px-3 py-2 rounded"
                  />

                  {editingProperty.shortTerm && (
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Price per night"
                        value={editingProperty.pricePerNight || ''}
                        onChange={(e) => setEditingProperty({
                          ...editingProperty,
                          pricePerNight: e.target.value
                        })}
                        className="w-full border px-3 py-2 rounded"
                      />
                      
                      <textarea
                        placeholder="Description"
                        value={editingProperty.description || ''}
                        onChange={(e) => setEditingProperty({
                          ...editingProperty,
                          description: e.target.value
                        })}
                        rows="3"
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`http://localhost:5000/api/houses/${editingProperty.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(editingProperty),
                        });

                        if (response.ok) {
                          alert('✅ Property updated successfully!');
                          setEditingProperty(null);
                          fetchMyListings();
                        } else {
                          alert('❌ Failed to update property');
                        }
                      } catch (error) {
                        console.error('Error updating property:', error);
                        alert('❌ Error updating property');
                      }
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingProperty(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded font-medium"
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
                  Notifications
                </h2>
                <div className="text-center py-12 bg-white/80 rounded-lg">
                  <FaBell className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
                  <p className="text-gray-500">Notifications will appear here.</p>
                </div>
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={ownerProfileData.email || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, email: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                          <input
                            type="tel"
                            value={ownerProfileData.contact || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, contact: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your contact number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">National ID (NIC)</label>
                          <input
                            type="text"
                            value={ownerProfileData.nic || ''}
                            onChange={(e) => setOwnerProfileData(prev => ({...prev, nic: e.target.value}))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
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
                        onClick={() => setShowBankModal(true)}
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
                          onClick={() => setShowBankModal(true)}
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
                <div className="text-center py-12 bg-white/80 rounded-lg">
                  <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500">Short term bookings will appear here.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <BankDetailsModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onSubmit={handleBankDetailsSubmit}
        ownerData={state?.ownerData || { 
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          nic: formData.nic,
          id: owner_id
        }}
      />

      {/* 🎨 Cute Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
    </>
  );
};

export default HouseDetails;