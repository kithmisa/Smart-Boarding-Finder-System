import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Bell,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Edit,
  Save,
  X,
  Trash2,
  MapPinIcon
} from 'lucide-react';
import './UserProfile.css';

const UserProfile = ({ userId: propUserId, onLogout }) => {
  const navigate = useNavigate();
  const { userId: urlUserId } = useParams(); // Get userId from URL if it's a route
  
  // Get user ID from props, URL params, or localStorage (in order of priority)
  const userId = propUserId || urlUserId || localStorage.getItem('user_id');
  
  // Check if user is authenticated
  const isAuthenticated = userId && userId !== 'null' && userId !== 'undefined';
  
  // Check if user is logged in (has any auth data)
  const isLoggedIn = localStorage.getItem('user_id') || localStorage.getItem('has_authed');
  

  
  // Error boundary for runtime errors
  const [hasError, setHasError] = useState(false);
  
  // State for current tab/section
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for profile data
  const [userProfile, setUserProfile] = useState({
    id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'user',
    status: 'active'
  });
  
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  
  // State for visit requests and notifications
  const [visitRequests, setVisitRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  // State for OTP verification
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  // State for payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   
       // Load all data
  useEffect(() => {
    if (userId) {
       const loadData = async () => {
         try {
           await Promise.all([
             fetchUserProfile(),
             fetchFavorites(),
             fetchVisitRequests(),
             fetchBookings(),
             fetchNotifications()
           ]);
         } catch (error) {
           console.error('Error loading user data:', error);
           setError('Failed to load user data');
         } finally {
           setLoading(false);
         }
       };
       
       loadData();
       
       // Fallback timeout to prevent infinite loading
       const timeoutId = setTimeout(() => {
         setLoading(false);
       }, 10000); // 10 seconds timeout
       
       return () => clearTimeout(timeoutId);
     } else {
       setLoading(false);
     }
  }, [userId, isAuthenticated]);
   
     // Check authentication - must come after all hooks
  if (!isAuthenticated && !isLoggedIn) {
    return (
      <div className="user-profile-page">
        <div className="user-profile-container">
          <div className="error-message">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Early return for error state - must come after all hooks
  if (hasError) {
    return (
      <div className="user-profile-page">
        <div className="user-profile-container">
          <div className="error-message">
            <h2>Something went wrong</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

   // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile for userId:', userId);
      console.log('API URL:', `http://localhost:5000/api/users/profile/${userId}`);
      
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
      console.log('Profile response status:', response.status);
      console.log('Profile response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        
                 // Check if we have user data
         if (data.user) {
           console.log('Setting user profile from data.user:', data.user);
           // Map backend field names to frontend field names
           const mappedUser = {
             ...data.user,
             first_name: data.user.firstName || data.user.first_name || '',
             last_name: data.user.lastName || data.user.last_name || '',
             email_verified: data.user.emailVerified || data.user.email_verified || false,
             created_at: data.user.createdAt || data.user.created_at || new Date().toISOString()
           };
           console.log('Mapped user profile:', mappedUser);
           setUserProfile(mappedUser);
           setEditData(mappedUser);
         } else if (data) {
           // If response is direct user data
           console.log('Setting user profile from direct data:', data);
           // Map backend field names to frontend field names
           const mappedUser = {
             ...data,
             first_name: data.firstName || data.first_name || '',
             last_name: data.lastName || data.last_name || '',
             email_verified: data.emailVerified || data.email_verified || false,
             created_at: data.createdAt || data.created_at || new Date().toISOString()
           };
           console.log('Mapped user profile:', mappedUser);
           setUserProfile(mappedUser);
           setEditData(mappedUser);
         } else {
           throw new Error('No user data received');
         }
      } else {
        console.error('Failed to fetch user profile:', response.status);
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        // If profile endpoint fails, try to get basic user info from localStorage
        const storedUserData = localStorage.getItem('user_data');
        console.log('Stored user data from localStorage:', storedUserData);
        
        let fallbackUser = {
          id: userId,
          username: 'User',
          email: 'user@example.com',
          first_name: 'User',
          last_name: 'Name',
          phone: '',
          role: 'user',
          status: 'active',
          email_verified: false,
          created_at: new Date().toISOString()
        };
        
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            console.log('Parsed stored user data:', parsedData);
            fallbackUser = { ...fallbackUser, ...parsedData };
          } catch (e) {
            console.error('Failed to parse stored user data:', e);
          }
        }
        
        console.log('Using fallback user data:', fallbackUser);
        setUserProfile(fallbackUser);
        setEditData(fallbackUser);
        setError(`Profile fetch failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Try to get user data from localStorage as fallback
      const storedUserData = localStorage.getItem('user_data');
      console.log('Error fallback - stored user data:', storedUserData);
      
              let fallbackUser = {
          id: userId,
          username: 'User',
          email: 'user@example.com',
          first_name: 'User',
          last_name: 'Name',
          phone: '',
          role: 'user',
          status: 'active',
          email_verified: false,
          created_at: new Date().toISOString()
        };
      
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          console.log('Error fallback - parsed stored user data:', parsedData);
          fallbackUser = { ...fallbackUser, ...parsedData };
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
        }
      }
      
      console.log('Error fallback - using fallback user data:', fallbackUser);
      setUserProfile(fallbackUser);
      setEditData(fallbackUser);
    }
  };

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      console.log('Fetching favorites for userId:', userId);
      const response = await fetch(`http://localhost:5000/api/users/favorites/user/${userId}`);
      console.log('Favorites response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Favorites data:', data);
        setFavorites(data.favorites || []);
      } else {
        console.error('Failed to fetch favorites:', response.status);
        const errorText = await response.text();
        console.error('Favorites error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Fetch visit requests
  const fetchVisitRequests = async () => {
    try {
      console.log('Fetching visit requests for userId:', userId);
      const response = await fetch(`http://localhost:5000/api/visit-requests/user/${userId}`);
      console.log('Visit requests response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Visit requests data:', data);
        setVisitRequests(data.visitRequests || []);
      } else {
        console.error('Failed to fetch visit requests:', response.status);
        const errorText = await response.text();
        console.error('Visit requests error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching visit requests:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications for userId:', userId);
      const response = await fetch(`http://localhost:5000/api/users/notifications/${userId}`);
      console.log('Notifications response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications:', response.status);
        const errorText = await response.text();
        console.error('Notifications error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings for userId:', userId);
      const response = await fetch(`http://localhost:5000/api/bookings/stay/user/${userId}`);
      console.log('Bookings response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bookings data:', data);
        setBookings(data.bookings || []);
      } else {
        console.error('Failed to fetch bookings:', response.status);
        const errorText = await response.text();
        console.error('Bookings error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Handle navigation
  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('user_id');
    localStorage.removeItem('has_authed');
    localStorage.removeItem('user_data');
    
    // Use onLogout prop if provided, otherwise navigate to home
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
      window.location.reload();
    }
  };

  // Handle profile editing
  const handleEditProfile = () => {
    setIsEditing(true);
    setEditData({ ...userProfile });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...userProfile });
    setShowOtpModal(false);
    setOtpCode('');
    setOtpSent(false);
    setPendingEmail('');
  };

  // Handle email change - requires OTP verification
  const handleEmailChange = async (newEmail) => {
    // Validate email parameter
    if (!newEmail || typeof newEmail !== 'string' || newEmail.trim() === '') {
      console.error('Invalid email parameter:', newEmail);
      console.error('Call stack:', new Error().stack);
      alert(`Invalid email address provided: ${newEmail}\n\nPlease check your email input and try again.`);
      return;
    }
    
    if (newEmail === userProfile.email) {
      return; // No change needed
    }
    
    try {
      // First check if email already exists
      const checkResponse = await fetch(`http://localhost:5000/api/users/check-email?email=${encodeURIComponent(newEmail)}`);
      
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.exists && checkData.userId !== userId) {
          alert('This email address is already registered by another user. Please use a different email.');
          return;
        }
      }
      
      // Email is available, send OTP
      console.log('Sending OTP request with data:', { 
        email: newEmail, 
        purpose: 'email_change'
      });
      
      // First, test if the backend is reachable
      try {
        console.log('Testing backend connectivity...');
        const testResponse = await fetch('http://localhost:5000/api/auth/debug-otp', {
          method: 'GET'
        });
        console.log('Backend test response status:', testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Backend is reachable, OTP storage info:', testData);
        }
      } catch (testError) {
        console.error('Backend connectivity test failed:', testError);
      }
      
      // Try the standard OTP request
      try {
        console.log('Sending OTP with standard format...');
        console.log('Request body:', JSON.stringify({ 
          email: newEmail,
          purpose: 'email_change'
        }));
        
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: newEmail,
            purpose: 'email_change'
          })
        });
        
        console.log('OTP response status:', response.status);
        console.log('OTP response headers:', response.headers);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('OTP sent successfully:', responseData);
          setPendingEmail(newEmail);
          setOtpSent(true);
          setShowOtpModal(true);
          return;
        } else {
          let errorData;
          try {
            errorData = await response.json();
            console.error('OTP error response:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            const errorText = await response.text();
            console.error('Raw error response:', errorText);
            errorData = { error: errorText || 'Unknown error' };
          }
          
          // Show the actual error from the backend
          const errorMessage = errorData?.error || errorData?.message || 'Unknown error occurred';
          console.error('OTP send failed. Backend error:', errorMessage);
          alert(`Failed to send OTP: ${errorMessage}\n\nPlease check your backend configuration.`);
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  // Verify OTP and update email
  const verifyOtpAndUpdateEmail = async () => {
    try {
      console.log('Verifying OTP with data:', { 
        email: pendingEmail, 
        otp: otpCode, 
        purpose: 'email_change' 
      });
      
      // Try the standard OTP verification
      try {
        console.log('Verifying OTP with standard format...');
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: pendingEmail,
            otp: otpCode,
            purpose: 'email_change'
          })
        });
        
        console.log('OTP verification response status:', response.status);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('OTP verified successfully:', responseData);
          
          // OTP verified, now update the profile with all current edit data
          const updatedEditData = { ...editData, email: pendingEmail };
          console.log('Updating profile with data:', updatedEditData);
          
          // Update editData state to include the new email
          setEditData(updatedEditData);
          
          // Call handleSaveProfile to save to database
          console.log('Calling handleSaveProfile with updated data...');
          await handleSaveProfile(updatedEditData);
          console.log('Profile save completed successfully');
          
          // Refresh user profile data to ensure UI shows latest data
          await fetchUserProfile();
          
          // Close OTP modal and reset states
          setShowOtpModal(false);
          setOtpCode('');
          setOtpSent(false);
          setPendingEmail('');
          
          // Show success message
          alert('Email verified and profile updated successfully!');
          return;
        } else {
          let errorData;
          try {
            errorData = await response.json();
            console.error('OTP verification error response:', errorData);
          } catch (parseError) {
            console.error('Failed to parse OTP verification error response:', parseError);
            const errorText = await response.text();
            console.error('Raw OTP verification error response:', errorText);
            errorData = { error: errorText || 'Unknown error' };
          }
          
          const errorMessage = errorData?.error || errorData?.message || 'Unknown error occurred';
          console.error('OTP verification failed. Backend error:', errorMessage);
          alert(`OTP verification failed: ${errorMessage}\n\nPlease check your backend configuration.`);
        }
      } catch (error) {
        console.error('Error in OTP verification:', error);
        alert('Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handleSaveProfile = async (dataToSave = null) => {
    try {
      const dataToUpdate = dataToSave || editData;
      
      // Check if email has changed (only if not coming from OTP verification)
      if (dataToUpdate.email && dataToUpdate.email !== userProfile.email && !pendingEmail) {
        // Email changed, need OTP verification
        console.log('Email changed from', userProfile.email, 'to', dataToUpdate.email);
        await handleEmailChange(dataToUpdate.email);
        return; // Don't proceed with save yet
      }
      
      // Clean the data to remove any circular references or invalid properties
      // Map frontend field names to backend field names and ensure required fields are not empty
      const cleanData = {
        username: dataToUpdate.username || userProfile.username || '',
        email: dataToUpdate.email || userProfile.email || '',
        firstName: dataToUpdate.first_name || userProfile.first_name || '',  // Map to backend field name
        lastName: dataToUpdate.last_name || userProfile.last_name || '',   // Map to backend field name
        phone: dataToUpdate.phone || userProfile.phone || ''
      };
      
      // Validate required fields
      if (!cleanData.username || !cleanData.email || !cleanData.firstName || !cleanData.lastName) {
        alert('Username, email, first name, and last name are required');
        return;
      }
      
      console.log('Saving profile data to database (mapped):', cleanData);
      console.log('Request URL:', `http://localhost:5000/api/users/profile/${userId}`);
      console.log('Request method: PUT');
      console.log('Request headers:', { 'Content-Type': 'application/json' });
      console.log('Request body:', JSON.stringify(cleanData));
      
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile update response:', data);
        
        // Map backend field names to frontend field names when updating
        const updatedUser = data.user || data;
        const mappedUser = {
          ...updatedUser,
          first_name: updatedUser.firstName || updatedUser.first_name || '',
          last_name: updatedUser.lastName || updatedUser.last_name || '',
          email_verified: updatedUser.emailVerified || updatedUser.email_verified || false,
          created_at: updatedUser.createdAt || updatedUser.created_at || new Date().toISOString()
        };
        
        console.log('Setting updated user profile:', mappedUser);
        setUserProfile(mappedUser);
        setEditData(mappedUser);
        setIsEditing(false);
        
        // Only show success alert if not coming from OTP verification
        if (!pendingEmail) {
          alert('Profile updated successfully!');
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Profile update failed:', errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error('Profile update failed - raw response:', errorText);
          errorData = { error: errorText || 'Unknown error' };
        }
        
        // Handle specific error cases with more user-friendly messages
        let errorMessage = errorData.error || errorData.message || 'Unknown error';
        if (errorMessage.includes('Email already exists')) {
          errorMessage = 'This email address is already registered to another user. Please use a different email address.';
        }
        
        alert(`Failed to update profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will remove all your data including favorites and bookings.'
    );
    
    if (confirmed) {
      const finalConfirm = window.confirm(
        'This is your final warning. Your account and ALL associated data will be permanently deleted. Are you absolutely sure?'
      );
      
      if (finalConfirm) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            alert('Your account has been successfully deleted.');
            handleLogout(); // Clear data and redirect
          } else {
            const errorData = await response.json();
            alert(`Failed to delete account: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      }
    }
  };

  // Handle Pay Now button click
  const handlePayNow = (booking) => {
    // Store booking data in localStorage to pass to Payment component
    localStorage.setItem('selectedBooking', JSON.stringify(booking));
    // Navigate to Payment component
    navigate('/payment');
  };

  // Handle payment processing
  const handleProcessPayment = async () => {
    if (!selectedBooking) return;
    
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing (replace with actual payment gateway integration)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payment status in backend
      const response = await fetch(`http://localhost:5000/api/bookings/stay/${selectedBooking.id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'paid',
          payment_method: paymentMethod
        }),
      });

      if (response.ok) {
        // Update local bookings state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === selectedBooking.id 
              ? { ...booking, payment_status: 'paid' }
              : booking
          )
        );
        
        alert('Payment completed successfully!');
        setShowPaymentModal(false);
        setSelectedBooking(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle favorite navigation
  const handleFavoriteClick = (houseId) => {
    navigate(`/boarding/${houseId}`);
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/notifications/${notificationId}/read`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        fetchNotifications();
      } else {
        console.error('Failed to mark notification as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  // Cancel visit request
  const cancelVisitRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this visit request?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/visit-requests/${requestId}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        if (response.ok) {
          fetchVisitRequests();
        } else {
          console.error('Failed to cancel visit request:', response.status);
        }
      } catch (error) {
        console.error('Error cancelling visit request:', error);
      }
    }
  };

  // Status and icon helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'cancelled': return <ClockIcon size={16} />;
      default: return <ClockIcon size={16} />;
    }
  };

  

  // Loading state
  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="user-profile-container">
                     <div className="loading-spinner">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
             <p className="text-gray-600">Loading user profile...</p>
             <p className="text-sm text-gray-400 mt-2">User ID: {userId || 'Loading...'}</p>
           </div>
        </div>
      </div>
    );
  }

     // Error state
   if (error) {
     return (
       <div className="user-profile-page">
         <div className="user-profile-container">
           <div className="error-message">
             <h2>Error Loading Profile</h2>
             <p>{error}</p>
             <div className="mt-4 space-x-3">
               <button 
                 onClick={() => {
                   setError('');
                   setLoading(true);
                   fetchUserProfile();
                 }}
                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
                 🔄 Retry
               </button>
               <button 
                 onClick={() => window.location.reload()}
                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
               >
                 🔄 Reload Page
               </button>
               <button 
                 onClick={() => setError('')}
                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
               >
                 ✅ Continue Anyway
               </button>
             </div>
           </div>
         </div>
       </div>
     );
   }

     return (
     <div className="user-profile-page">
       <div className="user-profile-container">
        {/* Header */}
        <div className="profile-header">
          <button 
            onClick={handleBackToHome}
            className="back-button"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="user-info">
            <div className="avatar">
              <User size={40} />
            </div>
            <div>
                             <h1 className="user-name">
                 {userProfile.first_name || userProfile.last_name 
                   ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                   : userProfile.username || 'User'
                 }
               </h1>
               <p className="user-email">{userProfile.email}</p>
               <span className={`status-badge ${userProfile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                 {userProfile.status}
               </span>
               
               
              

            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="logout-button"
            style={{ background: 'rgba(228, 219, 219, 0.56)' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

                          {/* Navigation Tabs */}
          <div className="profile-tabs">
           {[
             { id: 'profile', label: 'Profile', icon: User },
             { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites?.length || 0 },
             { id: 'requests', label: 'Visit Requests', icon: Calendar, count: visitRequests?.length || 0 },
             { id: 'bookings', label: 'My Bookings', icon: ClockIcon, count: bookings?.length || 0 },
             { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications?.filter(n => !n.is_read)?.length || 0 }
           ].map((tab) => {
             const Icon = tab.icon;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
               >
                 <Icon size={18} />
                 {tab.label}
                 {tab.count > 0 && (
                   <span className="ml-2 bg-orange-500 text-white py-0.5 px-2 rounded-full text-xs">
                     {tab.count}
                   </span>
                 )}
               </button>
             );
           })}
         </div>

                 

         {/* Content Area */}
         <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="content-header">
                <h2 className="content-title">Profile Information</h2>
                {!isEditing ? (
                  <button 
                    onClick={handleEditProfile}
                    className="edit-button"
                    style={{ background: 'linear-gradient(135deg,rgba(102, 11, 67, 0.96) 0%,rgba(87, 13, 62, 0.94) 100%)' }}
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                                         <button 
                       onClick={() => {
                         console.log('Save button clicked');
                         console.log('Current editData:', editData);
                         console.log('Current userProfile:', userProfile);
                         handleSaveProfile();
                       }}
                       className="save-button"
                       style={{ background: 'linear-gradient(135deg,rgba(28, 179, 23, 0.63) 0%,rgba(85, 201, 32, 0.68) 100%)' }}
                     >
                       <Save size={18} />
                       Save Changes
                     </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="cancel-button"
                      style={{ background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)' }}
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information Form */}
              <div className="profile-form">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isEditing ? 'Edit Profile Information' : 'Profile Information'}
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={isEditing ? editData.username || '' : userProfile.username || ''}
                      onChange={(e) => setEditData({...editData, username: e.target.value})}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                      placeholder="Enter username"
                    />
                  </div>
                                     <div className="form-group">
                     <label>Email</label>
                                           <input
                        type="email"
                        value={isEditing ? editData.email || '' : userProfile.email || ''}
                                               onChange={(e) => {
                         const newEmail = e.target.value;
                         console.log('Email input changed to:', newEmail);
                         setEditData({...editData, email: newEmail});
                       }}
                        className={`form-input ${!isEditing ? 'disabled' : ''}`}
                        disabled={!isEditing}
                        placeholder="Enter email address"
                      />
                      {isEditing && editData.email !== userProfile.email && editData.email && (
                        <p className="text-sm text-blue-600 mt-1">
                          📧 Email change detected. OTP verification will be required when saving.
                        </p>
                      )}
                   </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={isEditing ? editData.first_name || '' : userProfile.first_name || ''}
                      onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={isEditing ? editData.last_name || '' : userProfile.last_name || ''}
                      onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      disabled={!isEditing}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={isEditing ? editData.phone || '' : userProfile.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className={`form-input ${!isEditing ? 'disabled' : ''}`}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Danger Zone */}
                <div className="delete-account-section">
                  <h3 className="delete-account-title">Danger Zone</h3>
                  <p className="delete-account-description">
                    Once you delete your account, there is no going back. This will permanently delete your account and remove all your data including favorites, bookings, and payment history.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="delete-account-btn"
                    style={{ background: 'linear-gradient(135deg,rgba(92, 10, 10, 0.92) 0%,rgb(141, 16, 26) 100%)' }}
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="tab-content">
              <div className="content-header">
                <h2 className="content-title">My Favorites</h2>
              </div>

              {favorites && favorites.length > 0 ? (
                <div className="favorites-grid">
                  {favorites.map((favorite) => {
                    // Parse images properly
                    let imageArray = [];
                    if (favorite.images) {
                      if (typeof favorite.images === 'string') {
                        try {
                          imageArray = JSON.parse(favorite.images);
                        } catch {
                          imageArray = favorite.images.split(',').map(img => img.trim()).filter(img => img);
                        }
                      } else if (Array.isArray(favorite.images)) {
                        imageArray = favorite.images;
                      }
                    }

                    return (
                      <div
                        key={favorite.id}
                        className="favorite-card"
                        onClick={() => handleFavoriteClick(favorite.id)}
                      >
                        <div className="favorite-card-image">
                          {imageArray && imageArray.length > 0 ? (
                            <img
                              src={`http://localhost:5000/uploads/${imageArray[0]}`}
                              alt={favorite.title}
                              onError={(e) => {
                                e.target.src = '/placeholder-house.jpg';
                              }}
                            />
                          ) : (
                            <div className="favorite-no-image">
                              <MapPinIcon size={40} />
                              <span>No Image Available</span>
                            </div>
                          )}

                          {/* Short-term Badge */}
                          {favorite.shortTerm && (
                            <div className="short-term-badge">
                              📅 Short-term
                            </div>
                          )}

                          {/* Photo Count Badge */}
                          {imageArray && imageArray.length > 1 && (
                            <div className="photo-count-badge">
                              📷 {imageArray.length} photos
                            </div>
                          )}

                          {/* Heart Overlay */}
                          <div className="favorite-heart-overlay">
                            <Heart size={20} fill="red" color="red" />
                          </div>
                        </div>

                        <div className="favorite-card-content">
                          {/* Availability Badge */}
                          {favorite.availabilityStatus === 'available' && (
                            <div className="availability-badge">
                              🏠 AVAILABLE
                            </div>
                          )}

                          {/* Pricing Box */}
                          <div className="pricing-box">
                            <div className="monthly-price">
                              <span className="price-label">Monthly:</span>
                              <span className="price-amount">Rs. {favorite.price}</span>
                            </div>
                            {favorite.shortTerm && favorite.pricePerNight && (
                              <div className="nightly-price">
                                <span className="price-label">Per Night:</span>
                                <span className="price-amount">Rs. {favorite.pricePerNight}</span>
                              </div>
                            )}
                          </div>

                          <h3 className="favorite-title">{favorite.title}</h3>
                          
                          <div className="favorite-location">
                            <MapPin size={16} />
                            <span>{favorite.location}, {favorite.city}</span>
                          </div>

                          <div className="favorite-details">
                            <div className="favorite-detail-item">
                              <span>🛏️ {favorite.roomType}</span>
                            </div>
                            <div className="favorite-detail-item">
                              <span>🏠 {favorite.type}</span>
                            </div>
                            <div className="favorite-detail-item">
                              <span>👥 {favorite.genderAllowed}</span>
                            </div>
                          </div>

                          <div className="favorite-actions">
                            <button className="view-details-btn">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <Heart size={60} />
                  <h3 className="empty-title">No Favorites Yet</h3>
                  <p className="empty-description">
                    Start exploring boarding places and add them to your favorites!
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="empty-action-button"
                    style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}
                  >
                    Browse Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Visit Requests Tab */}
          {activeTab === 'requests' && (
            <div className="tab-content">
              <div className="content-header">
                <h2 className="content-title">My Visit Requests</h2>
              </div>

              {visitRequests && visitRequests.length > 0 ? (
                <div className="space-y-4">
                  {visitRequests.map((request) => (
                    <div key={request.id} className="bg-white/50 rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.boarding_title}</h3>
                          <p className="text-gray-600 text-sm flex items-center gap-2">
                            <MapPin size={14} />
                            {request.boarding_address}
                          </p>
                          <p className="text-gray-500 text-sm">Owner: {request.owner_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Requested Date:</p>
                            <p className="font-medium">{new Date(request.requested_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {request.requested_time && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Requested Time:</p>
                              <p className="font-medium">{request.requested_time}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.message && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MessageSquare size={14} />
                            Your Message:
                          </p>
                          <p className="text-gray-900 mt-1">{request.message}</p>
                        </div>
                      )}

                      {request.status === 'confirmed' && request.confirmed_date && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle size={16} />
                            Visit Confirmed!
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-green-700">
                                <strong>📅 Confirmed Date:</strong> {new Date(request.confirmed_date).toLocaleDateString()}
                              </p>
                              {request.confirmed_time && (
                                <p className="text-sm text-green-700 mt-1">
                                  <strong>⏰ Confirmed Time:</strong> {request.confirmed_time}
                                </p>
                              )}
                            </div>
                            
                            {/* Owner Contact Details */}
                            <div className="bg-white/70 p-3 rounded-lg border border-green-300">
                              <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-1">
                                <span>👤</span> Owner Contact
                              </h5>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-700">
                                  <strong>Name:</strong> {request.owner_name}
                                </p>
                                {request.owner_email && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <span>📧</span>
                                    <a 
                                      href={`mailto:${request.owner_email}`}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {request.owner_email}
                                    </a>
                                  </p>
                                )}
                                {request.owner_phone && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <span>📞</span>
                                    <a 
                                      href={`tel:${request.owner_phone}`}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {request.owner_phone}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {request.owner_response && (
                            <div className="bg-green-100 p-3 rounded-lg border border-green-300 mt-3">
                              <p className="text-sm text-green-800">
                                <strong>💬 Owner's Message:</strong> {request.owner_response}
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 flex items-center gap-1">
                              <span>💡</span>
                              <strong>Tip:</strong> Contact the owner directly if you need to reschedule or have questions about your visit.
                            </p>
                          </div>
                        </div>
                      )}

                      {request.status === 'rejected' && request.owner_response && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                            <XCircle size={16} />
                            Visit Request Declined
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                                <p className="text-sm text-red-800">
                                  <strong>📝 Owner's Response:</strong>
                                </p>
                                <p className="text-sm text-red-700 mt-1 whitespace-pre-line">
                                  {request.owner_response}
                                </p>
                              </div>
                            </div>
                            
                            {/* Owner Contact Details */}
                            <div className="bg-white/70 p-3 rounded-lg border border-red-300">
                              <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-1">
                                <span>👤</span> Owner Contact
                              </h5>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-700">
                                  <strong>Name:</strong> {request.owner_name}
                                </p>
                                {request.owner_email && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <span>📧</span>
                                    <a 
                                      href={`mailto:${request.owner_email}`}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {request.owner_email}
                                    </a>
                                  </p>
                                )}
                                {request.owner_phone && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <span>📞</span>
                                    <a 
                                      href={`tel:${request.owner_phone}`}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {request.owner_phone}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                              <p className="text-xs text-orange-700 flex items-center gap-1">
                                <span>💡</span>
                                <strong>Tip:</strong> If alternative dates were suggested, contact the owner to reschedule.
                              </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs text-blue-700 flex items-center gap-1">
                                <span>🔄</span>
                                <strong>Try Again:</strong> You can request a different date or browse similar properties.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <ClockIcon size={14} />
                            Waiting for owner confirmation...
                          </p>
                          <button
                            onClick={() => cancelVisitRequest(request.id)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                          >
                            Cancel Request
                          </button>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Requested on: {new Date(request.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Calendar size={60} />
                  <h3 className="empty-title">No Visit Requests Yet</h3>
                  <p className="empty-description">
                    Start exploring boarding places to make your first visit request!
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="empty-action-button"
                    style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}
                  >
                    Browse Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-content">
              <div className="content-header">
                <h2 className="content-title">My Bookings</h2>
              </div>

              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{booking.house_title}</h3>
                          <p className="text-gray-600">{booking.house_address}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'pending' && <ClockIcon className="text-yellow-600" size={16} />}
                          {booking.status === 'confirmed' && <CheckCircle className="text-green-600" size={16} />}
                          {booking.status === 'rejected' && <XCircle className="text-red-600" size={16} />}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                          <p className="text-gray-600"><strong>Check-in:</strong> {new Date(booking.check_in_date).toLocaleDateString()}</p>
                          <p className="text-gray-600"><strong>Check-out:</strong> {new Date(booking.check_out_date).toLocaleDateString()}</p>
                          {booking.check_in_time && (
                            <p className="text-gray-600"><strong>Check-in Time:</strong> {booking.check_in_time}</p>
                          )}
                          {booking.check_out_time && (
                            <p className="text-gray-600"><strong>Check-out Time:</strong> {booking.check_out_time}</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Property Owner</h4>
                          <p className="text-gray-600"><strong>Name:</strong> {booking.owner_name}</p>
                          <p className="text-gray-600"><strong>Email:</strong> {booking.owner_email}</p>
                          <p className="text-gray-600"><strong>Contact:</strong> {booking.owner_contact}</p>
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
                        
                        {/* Payment Status and Pay Now Button */}
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
                                 booking.payment_status === 'pending' ? '⏳ Pending' :
                                 '❌ Refunded'}
                              </span>
                            </div>
                            
                            {booking.status === 'confirmed' && booking.payment_status === 'pending' && (
                              <button
                                onClick={() => handlePayNow(booking)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                              >
                                <span>💳</span>
                                Pay Now
                              </button>
                            )}
                            
                            {booking.payment_status === 'paid' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Payment Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {(booking.special_requests || booking.owner_message) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <MessageSquare className="text-blue-600" size={16} />
                            Messages
                          </h4>
                          {booking.special_requests && (
                            <p className="text-blue-700 whitespace-pre-wrap"><strong>Guest Requests:</strong> {booking.special_requests}</p>
                          )}
                          {booking.owner_message && (
                            <p className="text-green-700 whitespace-pre-wrap mt-2"><strong>Owner Message:</strong> {booking.owner_message}</p>
                          )}
                        </div>
                      )}

                      {booking.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-red-800 mb-2">Rejection Reason</h4>
                          <p className="text-red-700">{booking.rejection_reason}</p>
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
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <ClockIcon className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500">Your stay bookings will appear here when you make reservations.</p>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="content-header">
                <h2 className="content-title">Notifications</h2>
              </div>

              {notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell size={16} className={notification.is_read ? 'text-gray-500' : 'text-blue-600'} />
                            <h4 className={`font-medium ${notification.is_read ? 'text-gray-700' : 'text-blue-900'}`}>
                              {notification.title}
                            </h4>
                          </div>
                          <p className={`${notification.is_read ? 'text-gray-600' : 'text-blue-800'}`}>
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => markNotificationRead(notification.id)}
                            className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Bell size={60} />
                  <h3 className="empty-title">No Notifications Yet</h3>
                  <p className="empty-description">
                    You'll receive notifications about your visit requests here.
                  </p>
                </div>
              )}
            </div>
          )}
                 </div>
       </div>

       {/* OTP Verification Modal */}
       {showOtpModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
             <h3 className="text-lg font-semibold mb-4">Email Verification Required</h3>
             <p className="text-gray-600 mb-4">
               We've sent a verification code to <strong>{pendingEmail}</strong>. 
               Please enter the code to verify your new email address.
             </p>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Verification Code
               </label>
               <input
                 type="text"
                 value={otpCode}
                 onChange={(e) => setOtpCode(e.target.value)}
                 placeholder="Enter 6-digit code"
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 maxLength={6}
               />
             </div>
             
             <div className="flex gap-3">
               <button
                 onClick={verifyOtpAndUpdateEmail}
                 className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                 disabled={otpCode.length !== 6}
               >
                 Verify & Update
               </button>
               <button
                 onClick={() => {
                   setShowOtpModal(false);
                   setOtpCode('');
                   setOtpSent(false);
                   setPendingEmail('');
                 }}
                 className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-medium"
               >
                 Cancel
               </button>
             </div>
             
                               {otpSent && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Didn't receive the code? Check your spam folder or{' '}
                      <button
                        onClick={async () => {
                          try {
                            await handleEmailChange(pendingEmail);
                          } catch (error) {
                            console.error('Error resending OTP:', error);
                            alert('Failed to resend OTP. Please try again.');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        resend
                      </button>
                    </p>
                  )}
           </div>
         </div>
       )}

       {/* Payment Modal */}
       {showPaymentModal && selectedBooking && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-gray-800">Complete Payment</h3>
               <button
                 onClick={() => setShowPaymentModal(false)}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <X size={20} />
               </button>
             </div>

             <div className="mb-4">
               <h4 className="font-medium text-gray-700 mb-2">Property: {selectedBooking.house_title}</h4>
               <p className="text-sm text-gray-600 mb-4">{selectedBooking.house_address}</p>
               
               <div className="bg-gray-50 rounded-lg p-4 mb-4">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-gray-600">Total Payment:</span>
                   <span className="font-semibold text-lg text-orange-600">Rs. {selectedBooking.total_payment}</span>
                 </div>
                 <div className="text-sm text-gray-500">
                   <p>Advance: Rs. {selectedBooking.advance_payment}</p>
                   <p>Service Charge: Rs. {selectedBooking.service_charge}</p>
                 </div>
               </div>
             </div>

             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
               <select
                 value={paymentMethod}
                 onChange={(e) => setPaymentMethod(e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               >
                 <option value="card">Credit/Debit Card</option>
                 <option value="bank">Bank Transfer</option>
                 <option value="mobile">Mobile Payment</option>
               </select>
             </div>

             <div className="flex gap-3">
               <button
                 onClick={() => setShowPaymentModal(false)}
                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleProcessPayment}
                 disabled={processingPayment}
                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
               >
                 {processingPayment ? (
                   <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                     Processing...
                   </>
                 ) : (
                   <>
                     <span>💳</span>
                     Pay Rs. {selectedBooking.total_payment}
                   </>
                 )}
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default UserProfile;