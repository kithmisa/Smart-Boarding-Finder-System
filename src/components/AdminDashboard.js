import React, { useEffect, useState, useRef } from 'react';
import { Users, Home, User, MessageCircle, Settings, Menu, X, Reply, Eye, Trash2, CheckCircle, Clock, Building, MapPin, Calendar, Star, Image, ExternalLink } from 'lucide-react';
import bgHero from '../assets/image.png';


const ReplyModal = ({ 
  isOpen, 
  onClose, 
  selectedComment, 
  onReply,
  replyMessage,
  setReplyMessage 
}) => {
  if (!isOpen) return null;

  const handleReply = () => {
    if (!selectedComment || !replyMessage.trim()) return;
    onReply(); // Call the parent's handleReply
  };

  const handleClose = () => {
    onClose(); // Call the parent's close handler
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Reply to Contact Message
          </h3>
          <button 
            onClick={() => {
            
              setReplyMessage('');
           
              onClose();
            }} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {selectedComment && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Original Message Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">From:</span>
                  <p className="text-gray-800">{selectedComment.name || 'Anonymous'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-800">{selectedComment.email}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Subject:</span>
                  <p className="text-gray-800">{selectedComment.title}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Message:</span>
                  <p className="text-gray-800 mt-1 bg-white p-3 rounded border">{selectedComment.comments}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Received:</span>
                  <p className="text-gray-800">
                    {selectedComment.created_at ? new Date(selectedComment.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Show existing reply if any */}
              {selectedComment.reply && (
                <div className="mt-4 bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2">Previous Reply:</h5>
                  <p className="text-sm text-green-700 whitespace-pre-wrap">{selectedComment.reply}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Sent: {selectedComment.replied_at ? new Date(selectedComment.replied_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>
            
           
              
              
             
              
              
              
              
              {/* Main Reply Textarea - Native HTML with inline styles only 
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply:
                </label>
                
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to the user..."
                  style={{
                    width: '100%',
                    height: '128px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                  direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal',
                    writingMode: 'horizontal-tb',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'none',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                
                <p className="text-xs text-gray-500 mt-1">
                Characters: {replyMessage.length}
                </p>
              </div>*/}


<div className="mb-4">
<label htmlFor="reply-textarea" className="block text-sm font-medium text-gray-700 mb-2">
  Your Reply:
</label>

<textarea
  id="reply-textarea"
  value={replyMessage}
  onChange={(e) => {
    console.log('Textarea changed:', e.target.value);
    setReplyMessage(e.target.value);
  }}
  placeholder="Type your reply to the user..."
  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  style={{
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: '1.5'
  }}
/>

<div className="mt-2 flex justify-between items-center">
  <p className="text-xs text-gray-500">
    Characters: {replyMessage.length}
  </p>
</div>
</div>
              
            
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Email Notification</p>
                  <p>Your reply will be sent via email to <strong>{selectedComment.email}</strong> and stored in our system.</p>
                  {selectedComment.reply && (
                    <p className="text-blue-700 mt-1">
                      <strong>Note:</strong> This will be sent as an additional follow-up email.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleReply}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!replyMessage.trim()}
          >
            <Reply size={16} />
            {selectedComment?.reply ? 'Send Additional Reply' : 'Send Reply & Email'}
          </button>
          <button
            onClick={() => {
             
              setReplyMessage('');
             onClose();
            }}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};






const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [houses, setHouses] = useState([]);
  const [comments, setComments] = useState([]);
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [houseDetailsModalOpen, setHouseDetailsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [testMessage, setTestMessage] = useState(''); // Test state
  const [selectedComment, setSelectedComment] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all'); // 'all', 'unread', 'replied'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use ref for direct DOM access
  const replyTextareaRef = useRef(null);

  // Fetch data based on active section
  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    if (activeSection === 'dashboard') return;
    
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      switch (activeSection) {
        case 'users':
          endpoint = '/api/admin/users';
          break;
        case 'owners':
          endpoint = '/api/admin/owners';
          break;
        case 'houses':
          endpoint = '/api/admin/houses';
          break;
        case 'comments':
          endpoint = '/api/admin/comments';
          break;
        case 'boarding':
          endpoint = '/api/admin/boarding-houses';
          break;
        default:
          return;
      }

      const res = await fetch(`http://localhost:5000${endpoint}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await res.json();
      
      if (data.success) {
        switch (activeSection) {
          case 'users':
            setUsers(data.users || []);
            break;
          case 'owners':
            setOwners(data.owners || []);
            break;
          case 'houses':
            setHouses(data.houses || []);
            break;
          case 'comments':
            setComments(data.comments || []);
            break;
          case 'boarding':
            setBoardingHouses(data.boardingHouses || []);
            break;
        }
      }
    } catch (err) {
      setError(`Error loading ${activeSection}: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle house approval/rejection
  const handleApproveHouse = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Approval failed');
      }

      // Update local state
      setHouses(houses.map(h => 
        h.id === houseId ? { ...h, status: 'approved' } : h
      ));
      
      alert('House approved successfully! It is now visible to users.');
    } catch (err) {
      alert('Approval failed: ' + err.message);
    }
  };

  const handleRejectHouse = async (houseId) => {
   const rejectionReason = prompt("Please provide a reason for rejecting this house:");
    
      if (rejectionReason === null) {
      console.log("Rejection cancelled by user");
      return; // Exit without sending request
    }
    
    // If user clicked OK but left empty, use default
    const finalReason = rejectionReason.trim() || "No reason provided";
    

    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  rejection_reason: finalReason })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Rejection failed');
      }

      // Update local state
      setHouses(houses.map(h => 
        h.id === houseId ? { ...h, status: 'rejected', rejection_reason: finalReason } : h
      ));
      
      alert('House rejected successfully.');
    } catch (err) {
      alert('Rejection failed: ' + err.message);
    }
  };

  // Fetch detailed house information
  const fetchHouseDetails = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/houses/${houseId}/details`);
      if (!res.ok) throw new Error('Failed to fetch house details');
      
      const data = await res.json();
      if (data.success) {
        setSelectedHouse(data.house);
        setHouseDetailsModalOpen(true);
      }
    } catch (err) {
      alert('Failed to fetch house details: ' + err.message);
    }
  };

  const handleConfirmBoarding = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/boarding-houses/${id}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Confirmation failed');
      }

      setBoardingHouses(boardingHouses.map(b => 
        b.id === id ? { ...b, status: 'confirmed', confirmed: true } : b
      ));
      
      alert('Boarding house confirmed successfully! It is now visible on the boarding page.');
    } catch (err) {
      alert('Confirmation failed: ' + err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${type}/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      switch (type) {
        case 'users':
          setUsers(users.filter(u => u.id !== id));
          break;
        case 'owners':
          setOwners(owners.filter(o => o.id !== id));
          break;
        case 'houses':
          setHouses(houses.filter(h => h.id !== id));
          break;
        case 'comments':
          setComments(comments.filter(c => c.id !== id));
          break;
        case 'boarding-houses':
          setBoardingHouses(boardingHouses.filter(b => b.id !== id));
          break;
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleReply = async () => {
    console.log('handleReply called with:', { selectedComment, replyMessage }); // Debug log
    
    if (!selectedComment || !replyMessage.trim()) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/admin/comments/${selectedComment.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: replyMessage,
        })
      });
      
      if (!res.ok) throw new Error('Failed to send reply');
      
      // Update local state
      setComments(comments.map(c =>
        c.id === selectedComment.id
          ? {
              ...c,
              reply: c.reply ? `${c.reply}\n\n--- Additional Reply ---\n${replyMessage}` : replyMessage,
              replied: true,
              replied_at: new Date().toISOString()
            }
          : c
      ));
      
      setReplyModalOpen(false);
      setReplyMessage('');
      setSelectedComment(null);
      alert('Reply sent successfully! Email notification delivered.');
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!window.confirm('Mark all unread messages as read?')) return;
    
    try {
      const unreadIds = comments.filter(c => !c.replied).map(c => c.id);
      if (unreadIds.length === 0) {
        alert('No unread messages to mark as read.');
        return;
      }
      
      // Update local state immediately for better UX
      setComments(comments.map(c => 
        !c.replied ? { ...c, replied: true, replied_at: new Date().toISOString() } : c
      ));
      
      // Send batch update to backend
      const res = await fetch('http://localhost:5000/api/admin/comments/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds: unreadIds })
      });
      
      if (!res.ok) throw new Error('Failed to mark messages as read');
      
      alert(`Marked ${unreadIds.length} messages as read successfully!`);
    } catch (err) {
      alert('Failed to mark messages as read: ' + err.message);
      // Revert local state on error
      fetchData();
    }
  };

  // Filter and search messages
  const getFilteredMessages = () => {
    let filtered = comments;
    
    // Apply status filter
    switch (messageFilter) {
      case 'unread':
        filtered = filtered.filter(c => !c.replied);
        break;
      case 'replied':
        filtered = filtered.filter(c => c.replied);
        break;
      default:
        break;
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.title?.toLowerCase().includes(term) ||
        c.comments?.toLowerCase().includes(term)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const filteredMessages = getFilteredMessages();
  const unreadCount = comments.filter(c => !c.replied).length;
  const repliedCount = comments.filter(c => c.replied).length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'owners', label: 'Owner Management', icon: User },
    { id: 'houses', label: 'House Management', icon: Home },
   /* { id: 'boarding', label: 'Boarding Houses', icon: Building },*/
    { id: 'comments', label: 'Comments & Replies', icon: MessageCircle },
  ];

  // House Details Modal Component
  const HouseDetailsModal = () => {
    if (!selectedHouse) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'approved': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'rejected': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };


       // ✅ FIXED: Proper rejection reason display
    const rejectionReasonText = selectedHouse.status === 'rejected' && selectedHouse.rejection_reason 
      ? selectedHouse.rejection_reason 
      : (selectedHouse.status === 'rejected' ? 'No reason provided' : null);

    // ✅ FIXED: Proper image handling
    const houseImages = selectedHouse.images || [];
    console.log('House images in modal:', houseImages); // Debug log



    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedHouse.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedHouse.status)}`}>
                    {selectedHouse.status || 'pending'}
                  </span>
                  <span className="text-gray-600">ID: {selectedHouse.id}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setHouseDetailsModalOpen(false);
                  setSelectedHouse(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Images */}
            {selectedHouse.images && selectedHouse.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Image size={20} />
                  Property Images ({selectedHouse.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHouse.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                       // src={`http://localhost:5000/${image.replace(/\\/g, '/')}`}
                       src={`http://localhost:5000/uploads/${image}`} 
                       alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = bgHero;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div><strong>Room Type:</strong> {selectedHouse.roomType}</div>
                  <div><strong>Gender Allowed:</strong> {selectedHouse.genderAllowed}</div>
                  <div><strong>Price:</strong> ${selectedHouse.price}</div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <strong>Location:</strong> {selectedHouse.location}
                  </div>
                  <div><strong>City:</strong> {selectedHouse.city}</div>
                  <div><strong>Type:</strong> {selectedHouse.type}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Availability</h3>
                <div className="space-y-2">
                  <div><strong>Status:</strong> {selectedHouse.availabilityStatus}</div>
                  {selectedHouse.availableDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <strong>Available From:</strong> {new Date(selectedHouse.availableDate).toLocaleDateString()}
                    </div>
                  )}
                  <div><strong>Short Term Available:</strong> {selectedHouse.shortTerm ? 'Yes' : 'No'}</div>
                  {selectedHouse.shortTerm && selectedHouse.pricePerNight && (
                    <div><strong>Price per Night:</strong> ${selectedHouse.pricePerNight}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Full Address</h3>
              <p className="text-gray-700">{selectedHouse.address}</p>
            </div>

            {/* Features */}
            {selectedHouse.features && selectedHouse.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.features.map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Short Term Features */}
            {selectedHouse.shortFeatures && selectedHouse.shortFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Short Term Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.shortFeatures.map((feature, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedHouse.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedHouse.description}</p>
              </div>
            )}

            {/* Highlights */}
            {selectedHouse.highlights && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center gap-2">
                  <Star size={18} />
                  Highlights
                </h3>
                <p className="text-gray-700">{selectedHouse.highlights}</p>
              </div>
            )}

            {/* Owner Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Owner Information</h3>
              <div className="space-y-2">
                <div><strong>Owner ID:</strong> {selectedHouse.owner_id}</div>
                {selectedHouse.owner_name && <div><strong>Owner Name:</strong> {selectedHouse.owner_name}</div>}
                {selectedHouse.owner_email && <div><strong>Owner Email:</strong> {selectedHouse.owner_email}</div>}
                {selectedHouse.owner_phone && <div><strong>Owner Phone:</strong> {selectedHouse.owner_phone}</div>}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Submission Details</h3>
              <div className="space-y-2">
                <div><strong>Submitted:</strong> {selectedHouse.created_at ? new Date(selectedHouse.created_at).toLocaleString() : 'N/A'}</div>
                <div><strong>Last Updated:</strong> {selectedHouse.updated_at ? new Date(selectedHouse.updated_at).toLocaleString() : 'N/A'}</div>
              </div>
            </div>

            {/* Rejection Reason */}
            {selectedHouse.status === 'rejected' && selectedHouse.rejection_reason && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 text-red-600">Rejection Reason</h3>
                <p className="text-red-700 bg-red-50 p-3 rounded">{selectedHouse.rejection_reason}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {selectedHouse.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveHouse(selectedHouse.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve House
                  </button>
                  <button
                    onClick={() => handleRejectHouse(selectedHouse.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject House
                  </button>
                </>
              )}
              {selectedHouse.status === 'approved' && (
                <a
                  href="http://localhost:3000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  View Live
                </a>
              )}
              <button
                onClick={() => handleDelete('houses', selectedHouse.id)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete House
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileModal = ({ profile, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Profile Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div><strong>ID:</strong> {profile?.id}</div>
          <div><strong>Name:</strong> {profile?.name || 'N/A'}</div>
          <div><strong>Email:</strong> {profile?.email || 'N/A'}</div>
          <div><strong>NIC:</strong> {profile?.nic || 'N/A'}</div>
          <div><strong>Phone:</strong> {profile?.contact || 'N/A'}</div>
        {/*  <div><strong>Created:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</div>*/}
        </div>
      </div>
    </div>
  );


  const renderDashboard = () => {
    const pendingHouses = houses.filter(h => h.status === 'pending' || !h.status).length;
    const approvedHouses = houses.filter(h => h.status === 'approved').length;
    const rejectedHouses = houses.filter(h => h.status === 'rejected').length;
    const pendingBoardings = boardingHouses.filter(b => b.status === 'pending' || !b.confirmed).length;
    const confirmedBoardings = boardingHouses.filter(b => b.status === 'confirmed' || b.confirmed).length;
    
    // Contact message statistics
    const totalMessages = comments.length;
    const repliedMessages = comments.filter(c => c.replied).length;
    const unreadMessages = totalMessages - repliedMessages;
    
    return (
      <div className="space-y-6">
        {/* Main Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Owners</p>
                <p className="text-2xl font-bold text-green-600">{owners.length}</p>
              </div>
              <User className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Houses</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingHouses}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Houses</p>
                <p className="text-2xl font-bold text-green-600">{approvedHouses}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>
        
        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Boardings</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBoardings}</p>
              </div>
              <Building className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed Boardings</p>
                <p className="text-2xl font-bold text-green-600">{confirmedBoardings}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-orange-600">{totalMessages}</p>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="text-red-600">● {unreadCount} unread</span>
                  <span className="text-green-600">● {repliedCount} replied</span>
                </div>
              </div>
              <MessageCircle className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Houses</p>
                <p className="text-2xl font-bold text-red-600">{rejectedHouses}</p>
              </div>
              <X className="text-red-500" size={32} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">User Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{user.id}</td>
                <td className="px-6 py-4 text-sm">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{user.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProfile(user)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete('users', user.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOwners = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Owner Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {owners.map(owner => (
              <tr key={owner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{owner.id}</td>
                <td className="px-6 py-4 text-sm">{owner.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{owner.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{owner.nic || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProfile(owner)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete('owners', owner.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHouses = () => {
    const pendingHouses = houses.filter(h => h.status === 'pending' || !h.status);
    const approvedHouses = houses.filter(h => h.status === 'approved');
    const rejectedHouses = houses.filter(h => h.status === 'rejected');

    return (
      <div className="space-y-6">
        {/* Pending Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <Clock size={20} />
              Pending Houses ({pendingHouses.length})
            </h3>
            <p className="text-sm text-yellow-600 mt-1">These houses are waiting for your approval</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price(lkr)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingHouses.map(house => (
                  <tr key={house.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{house.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                    <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {house.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{house.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        house.shortTerm 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {house.shortTerm ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.created_at ? new Date(house.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => fetchHouseDetails(house.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => handleApproveHouse(house.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectHouse(house.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete('houses', house.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingHouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending houses to review
              </div>
            )}
          </div>
        </div>

        {/* Approved Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle size={20} />
              Approved Houses ({approvedHouses.length})
            </h3>
            <p className="text-sm text-green-600 mt-1">
              These houses are live and visible to users at{' '}
              <a href="http://localhost:3000/boarding" target="_blank" rel="noopener noreferrer" className="underline">
                localhost:3000/boarding
              </a>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price(lkr)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvedHouses.map(house => (
                  <tr key={house.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{house.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                    <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {house.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{house.price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        house.shortTerm 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {house.shortTerm ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {house.approved_at ? new Date(house.approved_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => fetchHouseDetails(house.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <a
                          href="http://localhost:3000/boarding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
                        >
                          <ExternalLink size={14} />
                          Live
                        </a>
                        <button
                          onClick={() => handleDelete('houses', house.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {approvedHouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No approved houses yet
              </div>
            )}
          </div>
        </div>

        {/* Rejected Houses */}
        {rejectedHouses.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <X size={20} />
                Rejected Houses ({rejectedHouses.length})
              </h3>
              <p className="text-sm text-red-600 mt-1">These houses have been rejected</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rejectedHouses.map(house => (
                    <tr key={house.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{house.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{house.title}</td>
                      <td className="px-6 py-4 text-sm">{house.owner_name || house.owner_id}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {house.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {house.rejection_reason || 'No reason provided'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchHouseDetails(house.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete('houses', house.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBoardingHouses = () => {
    const pendingBoardings = boardingHouses.filter(b => b.status === 'pending' || !b.confirmed);
    const confirmedBoardings = boardingHouses.filter(b => b.status === 'confirmed' || b.confirmed);
    
    return (
      <div className="space-y-6">
        {/* Pending Boarding Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <Clock size={20} />
              Pending Boarding Houses ({pendingBoardings.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingBoardings.map(boarding => (
                  <tr key={boarding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{boarding.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{boarding.title}</td>
                    <td className="px-6 py-4 text-sm">{boarding.owner_name || boarding.owner_id}</td>
                    <td className="px-6 py-4 text-sm">{boarding.city || boarding.location}</td>
                    <td className="px-6 py-4 text-sm">${boarding.price}</td>
                    <td className="px-6 py-4 text-sm">
                      {boarding.created_at ? new Date(boarding.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmBoarding(boarding.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDelete('boarding-houses', boarding.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingBoardings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending boarding houses to review
              </div>
            )}
          </div>
        </div>

        {/* Confirmed Boarding Houses */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <CheckCircle size={20} />
              Confirmed Boarding Houses ({confirmedBoardings.length})
            </h3>
            <p className="text-sm text-green-600 mt-1">
              These are visible on <a href="http://localhost:3000/boarding" target="_blank" rel="noopener noreferrer" className="underline">localhost:3000/boarding</a>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {confirmedBoardings.map(boarding => (
                  <tr key={boarding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{boarding.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{boarding.title}</td>
                    <td className="px-6 py-4 text-sm">{boarding.owner_name || boarding.owner_id}</td>
                    <td className="px-6 py-4 text-sm">{boarding.city || boarding.location}</td>
                    <td className="px-6 py-4 text-sm">${boarding.price}</td>
                    <td className="px-6 py-4 text-sm">
                      {boarding.confirmed_at ? new Date(boarding.confirmed_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <a
                          href="http://localhost:3000/boarding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                        >
                          <Eye size={14} />
                          View Live
                        </a>
                        <button
                          onClick={() => handleDelete('boarding-houses', boarding.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {confirmedBoardings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No confirmed boarding houses yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComments = () => {
    return (
      <div className="space-y-6">
        {/* Header with Stats and Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Contact Messages & Replies</h3>
                <p className="text-sm text-gray-600 mt-1">Manage and respond to user inquiries from the contact form</p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Total: {comments.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Unread: {unreadCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Replied: {repliedCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Tabs */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    messageFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Messages
                </button>
                <button
                  onClick={() => setMessageFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    messageFilter === 'unread'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setMessageFilter('replied')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    messageFilter === 'replied'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Replied ({repliedCount})
                </button>
              </div>
              
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={() => {
                    setMessageFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages List */}
          <div className="p-6">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No messages found' : 'No messages yet'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `No messages match "${searchTerm}"` 
                    : 'Contact form submissions will appear here'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`border rounded-lg p-4 transition-all ${
                      comment.replied 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            comment.replied 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {comment.replied ? 'Replied' : 'Unread'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {comment.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {comment.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-800 mb-1">{comment.title}</h4>
                          <p className="text-gray-700">{comment.comments}</p>
                        </div>
                        
                        {comment.reply && (
                          <div className="mt-3 bg-white p-3 rounded border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-green-800">Admin Reply:</span>
                              <span className="text-xs text-green-600">
                                {comment.replied_at ? new Date(comment.replied_at).toLocaleString() : 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-green-700">{comment.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setSelectedComment(comment);
                          setReplyModalOpen(true);
                        }}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1 text-sm px-3 py-1 rounded transition-colors"
                      >
                        <Reply size={14} />
                        Reply 
                      </button>
                      
                      <button
                        onClick={() => handleDelete('comments', comment.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'owners':
        return renderOwners();
      case 'houses':
        return renderHouses();
      case 'boarding':
        return renderBoardingHouses();
      case 'comments':
        return renderComments();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 mt-20">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-xl text-gray-800 ${sidebarOpen ? 'block' : 'hidden'}`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const unreadCount = item.id === 'comments' ? comments.filter(c => !c.replied).length : 0;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors relative ${
                  activeSection === item.id ? 'bg-blue-100 border-r-2 border-blue-500' : ''
                }`}
              >
                <Icon size={20} className={`${activeSection === item.id ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} ${
                  activeSection === item.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
                
                {/* Notification badge for unread messages */}
                {unreadCount > 0 && (
                  <div className={`ml-auto ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 mt-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {selectedProfile && (
        <ProfileModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
      
      {houseDetailsModalOpen && <HouseDetailsModal />}
      
      
      {replyModalOpen && (
  <ReplyModal 
    isOpen={replyModalOpen}
    onClose={() => {
      setReplyModalOpen(false);
      setReplyMessage('');
      setSelectedComment(null);
    }}
    selectedComment={selectedComment}
    onReply={handleReply}
    replyMessage={replyMessage}
    setReplyMessage={setReplyMessage}
  />
)}
    </div>
  );
};

export default AdminDashboard;