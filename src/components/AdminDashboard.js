import React, { useEffect, useState, useRef } from 'react';
import { Users, Home, User, MessageCircle, Settings, Menu, X, Reply, Eye, Trash2, CheckCircle, Clock, Building, MapPin, Calendar, Star, Image, ExternalLink, CalendarCheck, Mail, Send } from 'lucide-react';
import bgHero from '../assets/image.png';
import { Moon, Sun } from 'lucide-react';


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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
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
  const [darkMode, setDarkMode] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [houses, setHouses] = useState([]);
  const [comments, setComments] = useState([]);
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [visitRequests, setVisitRequests] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [houseDetailsModalOpen, setHouseDetailsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [testMessage, setTestMessage] = useState(''); // Test state
  const [selectedComment, setSelectedComment] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all'); // 'all', 'unread', 'replied'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  // Email modal states
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  
  // Use ref for direct DOM access
  const replyTextareaRef = useRef(null);

  // Function to fetch owner banking details
  const fetchOwnerBankingDetails = async (ownerId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/owners/${ownerId}/banking`);
      if (res.ok) {
        const data = await res.json();
        return data.banking || null;
      }
    } catch (error) {
      console.error('Error fetching banking details:', error);
    }
    return null;
  };

  // Parse combined reply text into a threaded list of segments (admin/user)
  const parseReplyThread = (replyText, repliedAt) => {
    if (!replyText || typeof replyText !== 'string') return [];
    const lines = replyText.split('\n');
    const segments = [];
    let current = { role: 'admin', timestamp: repliedAt || null, text: '' };
    const userRegex = /^--- User Reply \((.*?)\) ---$/;
    const adminMoreRegex = /^--- Additional Reply ---$/;

    for (const rawLine of lines) {
      const line = rawLine.replace(/\r$/, '');
      const userMatch = line.match(userRegex);
      if (userMatch) {
        if (current.text.trim()) segments.push(current);
        current = { role: 'user', timestamp: userMatch[1] || null, text: '' };
        continue;
      }
      if (adminMoreRegex.test(line)) {
        if (current.text.trim()) segments.push(current);
        current = { role: 'admin', timestamp: null, text: '' };
        continue;
      }
      current.text += (current.text ? '\n' : '') + line;
    }
    if (current.text.trim()) segments.push(current);
    return segments;
  };

  const formatDateTime = (dateValue) => {
    return dateValue ? new Date(dateValue).toLocaleString() : 'N/A';
  };

  const getLastThreadSnippet = (replyText, fallback) => {
    if (replyText) {
      const thread = parseReplyThread(replyText);
      if (thread.length > 0) {
        const last = thread[thread.length - 1].text || '';
        return last.replace(/\s+/g, ' ').slice(0, 120);
      }
    }
    return (fallback || '').replace(/\s+/g, ' ').slice(0, 120);
  };

  const getLastActivity = (comment) => {
    return comment.replied_at || comment.created_at;
  };

  // Avatar helpers for left list (consistent colors and initials)
  const getInitials = (name, email) => {
    const source = (name && name.trim()) || (email && email.split('@')[0]) || 'U';
    const parts = source.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getAvatarBgClass = (email) => {
    const palettes = [
      darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
      darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
      darkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-700',
      darkMode ? 'bg-rose-900 text-rose-300' : 'bg-rose-100 text-rose-700',
      darkMode ? 'bg-fuchsia-900 text-fuchsia-300' : 'bg-fuchsia-100 text-fuchsia-700',
      darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700',
      darkMode ? 'bg-lime-900 text-lime-300' : 'bg-lime-100 text-lime-700'
    ];
    const key = (email || '').toLowerCase();
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return palettes[hash % palettes.length];
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Dark mode classes
  const darkClasses = {
    bg: darkMode ? 'bg-gray-900' : 'bg-transparent',
    card: darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700/90' : 'hover:bg-gray-50/90',
    sidebar: darkMode ? 'bg-gray-800/95' : 'bg-white/95',
    sidebarHover: darkMode ? 'hover:bg-gray-700/90' : 'hover:bg-blue-50/90',
    sidebarActive: darkMode ? 'bg-gray-700/90 border-gray-600' : 'bg-blue-100/90 border-blue-500'
  };

  // Fetch data based on active section
  useEffect(() => {
    fetchData();
  }, [activeSection]);

  // Clear search term when switching sections
  useEffect(() => {
    setSearchTerm('');
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
        case 'visitRequests':
          endpoint = '/api/admin/visit-requests';
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
          case 'visitRequests':
            setVisitRequests(data.visitRequests || []);
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
    { id: 'visitRequests', label: 'Visit Requests', icon: CalendarCheck },
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto mt-25 mb-2">
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
            {selectedHouse.images && Array.isArray(selectedHouse.images) && selectedHouse.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Image size={20} />
                  Property Images ({selectedHouse.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedHouse.images.map((image, index) => {
                    // Handle different image path formats
                    let imageSrc = '';
                    if (image.startsWith('http')) {
                      imageSrc = image;
                    } else if (image.startsWith('/')) {
                      imageSrc = `http://localhost:5000${image}`;
                    } else {
                      imageSrc = `http://localhost:5000/uploads/${image}`;
                    }
                    
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageSrc}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            console.log('Image failed to load:', imageSrc);
                            e.target.src = bgHero;
                          }}
                          onLoad={() => console.log('Image loaded successfully:', imageSrc)}
                        />
                      </div>
                    );
                  })}
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
            {selectedHouse.features && Array.isArray(selectedHouse.features) && selectedHouse.features.length > 0 && (
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
            {selectedHouse.shortFeatures && Array.isArray(selectedHouse.shortFeatures) && selectedHouse.shortFeatures.length > 0 && (
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

  const ProfileModal = ({ profile, onClose }) => {
    const [activeTab, setActiveTab] = useState('basic');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">User Profile Details</h3>
                <p className="text-blue-100 mt-1">Complete user information and activity summary</p>
              </div>
              <button 
                onClick={onClose} 
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* User Overview Card */}
          <div className="p-6 pb-0">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {profile?.first_name} {profile?.last_name}
                  </h4>
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile?.status || 'Unknown'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      ID: {profile?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Basic Information
                </div>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Activity Summary
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Basic Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">User ID</label>
                      <p className="text-gray-900 font-mono text-lg">{profile?.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900 text-lg">{profile?.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900 text-lg">{profile?.first_name} {profile?.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-gray-900 text-lg">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-900 text-lg">{profile?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <p className="text-gray-900 text-lg">{profile?.status || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-gray-900 text-lg">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900 text-lg">
                        {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Activity Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Visit Requests */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-blue-800">Visit Requests</h6>
                      <span className="text-2xl font-bold text-blue-600">
                        {profile?.activity?.visitRequests?.summary?.total_requests || 0}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Pending:</span>
                        <span>{profile?.activity?.visitRequests?.summary?.pending_requests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Confirmed:</span>
                        <span>{profile?.activity?.visitRequests?.summary?.confirmed_requests || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waiting List */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-orange-800">Waiting List</h6>
                      <span className="text-2xl font-bold text-orange-600">
                        {profile?.activity?.waitingList?.summary?.total_waiting || 0}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Waiting:</span>
                        <span>{profile?.activity?.waitingList?.summary?.active_waiting || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Notified:</span>
                        <span>{profile?.activity?.waitingList?.summary?.notified_waiting || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-purple-800">Reviews</h6>
                      <span className="text-2xl font-bold text-purple-600">
                        {profile?.activity?.reviews?.summary?.total_reviews || 0}
                      </span>
                    </div>
                    {profile?.activity?.reviews?.summary?.total_reviews > 0 && (
                      <div className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span>Avg Rating:</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {typeof profile.activity.reviews.summary.average_rating === 'number' ? profile.activity.reviews.summary.average_rating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                  {/* Visit Requests Details */}
                  {profile?.activity?.visitRequests?.details && profile.activity.visitRequests.details.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h6 className="font-medium text-blue-800 mb-3">Properties with Visit Requests</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.visitRequests.details.map((request, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-blue-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {request.house_id}</div>
                                <div className="text-sm text-gray-600">{request.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">Requested: {new Date(request.requested_date).toLocaleDateString()}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Waiting List Details */}
                  {profile?.activity?.waitingList?.details && profile.activity.waitingList.details.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h6 className="font-medium text-orange-800 mb-3">Properties on Waiting List</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.waitingList.details.map((waiting, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-orange-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {waiting.house_id}</div>
                                <div className="text-sm text-gray-600">{waiting.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">Joined: {new Date(waiting.joined_at).toLocaleDateString()}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                waiting.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                waiting.status === 'notified' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {waiting.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews Details */}
                  {profile?.activity?.reviews?.details && profile.activity.reviews.details.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h6 className="font-medium text-purple-800 mb-3">Properties Reviewed</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.reviews.details.map((review, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-purple-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {review.house_id}</div>
                                <div className="text-sm text-gray-600">{review.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">Rating: {review.rating}/5 ⭐</div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                <div>{new Date(review.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h6 className="font-medium text-gray-800 mb-3">Recent Activity (30 days)</h6>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Visits:</span>
                      <span className="text-blue-600 font-medium">{profile?.activity?.recentActivity?.recent_visits || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waiting:</span>
                      <span className="text-orange-600 font-medium">{profile?.activity?.recentActivity?.recent_waiting || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reviews:</span>
                      <span className="text-purple-600 font-medium">{profile?.activity?.recentActivity?.recent_reviews || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => openEmailModal(
                  {
                    name: `${profile?.first_name} ${profile?.last_name}`,
                    email: profile?.email
                  },
                  'Message from Smart Boarding Finder Admin'
                )}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Mail size={18} />
                Send Email
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OwnerModal = ({ profile, onClose }) => {
    const [activeTab, setActiveTab] = useState('basic');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Owner Profile Details</h3>
                <p className="text-green-100 mt-1">Complete owner information and activity summary</p>
              </div>
              <button 
                onClick={onClose} 
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Owner Overview Card */}
          <div className="p-6 pb-0">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || 'O'}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {profile?.name || 'Unknown Owner'}
                  </h4>
                  <p className="text-gray-600">{profile?.email || 'N/A'}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Property Owner
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      NIC: {profile?.nic || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Basic Information
                </div>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Activity Summary
                </div>
              </button>


              <button
  onClick={() => setActiveTab('banking')}
  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
    activeTab === 'banking'
      ? 'bg-white text-purple-600 shadow-sm'
      : 'text-gray-600 hover:text-gray-800'
  }`}
>
  <div className="flex items-center justify-center gap-2">
    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
    Bank Details
  </div>
</button>

            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'basic' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Basic Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Owner ID</label>
                      <p className="text-gray-900 font-mono text-lg">{profile?.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900 text-lg">{profile?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-gray-900 text-lg">{profile?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NIC Number</label>
                      <p className="text-gray-900 text-lg font-mono">
                        {profile?.nic || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Number</label>
                      <p className="text-gray-900 text-lg">{profile?.contact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Activity Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Properties */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-green-800">Properties</h6>
                      <span className="text-2xl font-bold text-green-600">
                        {profile?.activity?.properties?.summary?.total_properties || 0}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Approved:</span>
                        <span>{profile?.activity?.properties?.summary?.approved_properties || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Pending:</span>
                        <span>{profile?.activity?.properties?.summary?.pending_properties || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Available:</span>
                        <span>{profile?.activity?.properties?.summary?.available_properties || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visit Requests */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-blue-800">Visit Requests</h6>
                      <span className="text-2xl font-bold text-blue-600">
                        {profile?.activity?.visitRequests?.summary?.total_requests || 0}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Pending:</span>
                        <span>{profile?.activity?.visitRequests?.summary?.pending_requests || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Confirmed:</span>
                        <span>{profile?.activity?.visitRequests?.summary?.confirmed_requests || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-purple-800">Reviews</h6>
                      <span className="text-2xl font-bold text-purple-600">
                        {profile?.activity?.reviews?.summary?.total_reviews || 0}
                      </span>
                    </div>
                    {profile?.activity?.reviews?.summary?.total_reviews > 0 && (
                      <div className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span>Avg Rating:</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {typeof profile.activity.reviews.summary.average_rating === 'number' ? profile.activity.reviews.summary.average_rating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Waiting List */}
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-medium text-orange-800">Waiting List</h6>
                      <span className="text-2xl font-bold text-orange-600">
                        {profile?.activity?.waitingList?.summary?.total_waiting || 0}
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Waiting:</span>
                        <span>{profile?.activity?.waitingList?.summary?.active_waiting || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Notified:</span>
                        <span>{profile?.activity?.waitingList?.summary?.notified_waiting || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                  {/* Properties Added */}
                  {profile?.activity?.properties?.details && profile.activity.properties.details.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h6 className="font-medium text-green-800 mb-3">Properties Added</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.properties.details.map((property, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-green-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {property.id}</div>
                                <div className="text-sm text-gray-600">{property.title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">Location: {property.location || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Price: LKR {property.price || 'N/A'}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                property.status === 'approved' ? 'bg-green-100 text-green-700' :
                                property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                property.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {property.status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visit Requests Details */}
                  {profile?.activity?.visitRequests?.details && profile.activity.visitRequests.details.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h6 className="font-medium text-blue-800 mb-3">Visit Requests for Properties</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.visitRequests.details.map((request, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-blue-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {request.house_id}</div>
                                <div className="text-sm text-gray-600">{request.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">User: {request.user_name || 'Unknown User'}</div>
                                <div className="text-sm text-gray-600">Requested: {new Date(request.requested_date).toLocaleDateString()}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Waiting List Details */}
                  {profile?.activity?.waitingList?.details && profile.activity.waitingList.details.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h6 className="font-medium text-orange-800 mb-3">Waiting List for Properties</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.waitingList.details.map((waiting, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-orange-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-800">Property ID: {waiting.house_id}</div>
                                <div className="text-sm text-gray-600">{waiting.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">User: {waiting.user_name || 'Unknown User'}</div>
                                <div className="text-sm text-gray-600">Joined: {new Date(waiting.joined_at).toLocaleDateString()}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                waiting.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                                waiting.status === 'notified' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {waiting.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews Details */}
                  {profile?.activity?.reviews?.details && profile.activity.reviews.details.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h6 className="font-medium text-purple-800 mb-3">Reviews for Properties</h6>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {profile.activity.reviews.details.map((review, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-purple-100">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">Property ID: {review.house_id}</div>
                                <div className="text-sm text-gray-600">{review.house_title || 'Unknown Property'}</div>
                                <div className="text-sm text-gray-600">User: {review.user_name || 'Unknown User'}</div>
                                <div className="text-sm text-gray-600">Rating: {review.rating}/5 ⭐</div>
                              </div>
                              <div className="text-right text-xs text-gray-500 ml-4">
                                <div>{new Date(review.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                            {review.review_comment && (
                              <div className="mt-2 p-2 bg-gray-50 rounded border-l-4 border-purple-300">
                                <div className="text-xs text-gray-500 mb-1">Review:</div>
                                <div className="text-sm text-gray-700">{review.review_comment}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h6 className="font-medium text-gray-800 mb-3">Recent Activity (30 days)</h6>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Properties:</span>
                      <span className="text-green-600 font-medium">{profile?.activity?.recentActivity?.recent_properties || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visits:</span>
                      <span className="text-blue-600 font-medium">{profile?.activity?.recentActivity?.recent_visits || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reviews:</span>
                      <span className="text-purple-600 font-medium">{profile?.activity?.recentActivity?.recent_reviews || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waiting:</span>
                      <span className="text-orange-600 font-medium">{profile?.activity?.recentActivity?.recent_waiting || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {activeTab === 'banking' && (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
      Banking Information
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Bank Name</label>
          <p className="text-gray-900 text-lg">{profile?.bank_name || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Account Holder Name</label>
          <p className="text-gray-900 text-lg">{profile?.account_holder_name || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Account Number</label>
          <p className="text-gray-900 text-lg font-mono">
            {profile?.account_number || 'Not provided'}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Account Type</label>
          <p className="text-gray-900 text-lg capitalize">{profile?.account_type || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Branch Name</label>
          <p className="text-gray-900 text-lg">{profile?.branch_name || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Branch Code</label>
          <p className="text-gray-900 text-lg font-mono">{profile?.branch_code || 'Not provided'}</p>
        </div>
      </div>
    </div>
    
    {/* Bank Details Status */}
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="font-medium text-gray-800">Bank Details Status</h6>
          <p className="text-sm text-gray-600">
            {profile?.bank_name && profile?.account_number ? 
              'Complete banking information available' : 
              'Banking information incomplete'
            }
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          profile?.bank_name && profile?.account_number ? 
            'bg-green-100 text-green-800' : 
            'bg-yellow-100 text-yellow-800'
        }`}>
          {profile?.bank_name && profile?.account_number ? 'Complete' : 'Incomplete'}
        </div>
      </div>
    </div>
  </div>
)}

  </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => openEmailModal(
                  {
                    name: profile?.name,
                    email: profile?.email
                  },
                  'Message from Smart Boarding Finder Admin'
                )}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Mail size={18} />
                Send Email
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Owners</p>
                <p className="text-2xl font-bold text-green-600">{owners.length}</p>
              </div>
              <User className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Houses</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingHouses}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
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
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Boardings</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBoardings}</p>
              </div>
              <Building className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed Boardings</p>
                <p className="text-2xl font-bold text-green-600">{confirmedBoardings}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
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

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
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

  const renderUsers = () => {
    // Filter users based on search term
    const filteredUsers = users.filter(user => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        user.id?.toString().includes(searchLower) ||
        (user.username || '').toLowerCase().includes(searchLower) ||
        (user.first_name || '').toLowerCase().includes(searchLower) ||
        (user.last_name || '').toLowerCase().includes(searchLower) ||
        (user.email || '').toLowerCase().includes(searchLower) ||
        (user.phone || '').includes(searchTerm) ||
        (user.status || '').toLowerCase().includes(searchLower)
      );
    });

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name, email, ID, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {searchTerm ? `Found ${filteredUsers.length} user(s) matching "${searchTerm}"` : `Total: ${users.length} users`}
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No users match "${searchTerm}"` 
                : 'User registrations will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.first_name} {user.last_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProfile({ ...user, type: 'user' })}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => openEmailModal(
                            { 
                              name: `${user.first_name} ${user.last_name}`.trim() || user.username, 
                              email: user.email 
                            },
                            'Message from Smart Boarding Finder Admin'
                          )}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <Mail size={16} />
                          Email
                        </button>
                        <button
                          onClick={() => handleDelete('users', user.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
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
        )}
      </div>
    );
  };



  const renderHouses = () => {
    // Filter houses based on search term
    const filteredHouses = houses.filter(house => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        house.id?.toString().includes(searchLower) ||
        (house.title || '').toLowerCase().includes(searchLower) ||
        (house.owner_name || '').toLowerCase().includes(searchLower) ||
        (house.location || '').toLowerCase().includes(searchLower) ||
        (house.price || '').toString().includes(searchTerm) ||
        (house.status || '').toLowerCase().includes(searchLower)
      );
    });

    const pendingHouses = filteredHouses.filter(h => h.status === 'pending' || !h.status);
    const approvedHouses = filteredHouses.filter(h => h.status === 'approved');
    const rejectedHouses = filteredHouses.filter(h => h.status === 'rejected');

    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">House Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search houses by title, owner, location, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Home className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {searchTerm ? `Found ${filteredHouses.length} house(s) matching "${searchTerm}"` : `Total: ${houses.length} houses`}
          </div>
        </div>
        {/* Pending Houses */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 bg-yellow-50/80">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 bg-green-50/80">
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
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/20 bg-red-50/80">
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

  const renderOwners = () => {
    // Filter owners based on search term
    const filteredOwners = owners.filter(owner => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        owner.id?.toString().includes(searchLower) ||
        (owner.name || '').toLowerCase().includes(searchLower) ||
        (owner.email || '').toLowerCase().includes(searchLower) ||
        (owner.nic_original || '').toLowerCase().includes(searchLower) ||
        (owner.contact || '').includes(searchTerm) ||
        (owner.address || '').toLowerCase().includes(searchLower)
      );
    });

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Owner Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search owners by name, email, NIC, contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {searchTerm ? `Found ${filteredOwners.length} owner(s) matching "${searchTerm}"` : `Total: ${owners.length} owners`}
          </div>
        </div>
        
        {filteredOwners.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No owners found' : 'No owners yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No owners match "${searchTerm}"` 
                : 'Owner registrations will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOwners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {owner.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{owner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {owner.nic || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{owner.contact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            const bankingDetails = await fetchOwnerBankingDetails(owner.id);
                            setSelectedProfile({ 
                              ...owner, 
                              type: 'owner',
                              ...bankingDetails 
                            });
                            setActiveTab('basic');
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete('owners', owner.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
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
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 bg-yellow-50/80">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 bg-green-50/80">
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
        <div className={`${darkClasses.card} rounded-lg shadow-lg border ${darkClasses.border} backdrop-blur-sm`}>
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className={`text-lg font-semibold ${darkClasses.text}`}>Contact Messages & Replies</h3>
                <p className={`text-sm ${darkClasses.textSecondary} mt-1`}>Manage and respond to user inquiries from the contact form</p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className={darkClasses.textSecondary}>Total: {comments.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={darkClasses.textSecondary}>Unread: {unreadCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={darkClasses.textSecondary}>Replied: {repliedCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters and Search */}
          <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700/80' : 'bg-gray-50/80'} border-b border-white/20 backdrop-blur-sm`}>
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
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:5000/api/admin/comments/sync-email-replies?includeSeen=true&fallbackLatest=true', {
                        method: 'POST'
                      });
                      if (!res.ok) throw new Error('Sync failed');
                      // Refresh comments after sync
                      await fetchData();
                      alert('Synced email replies successfully');
                    } catch (e) {
                      alert('Sync failed: ' + e.message);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sync Replies
                </button>
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
          
          {/* Mailbox Layout */}
          <div className="p-6">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className={`${darkClasses.textMuted} mb-4`}>
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className={`text-lg font-medium ${darkClasses.text} mb-2`}>
                  {searchTerm ? 'No messages found' : 'No messages yet'}
                </h3>
                <p className={darkClasses.textMuted}>
                  {searchTerm 
                    ? `No messages match "${searchTerm}"` 
                    : 'Contact form submissions will appear here'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left: Message List */}
                <div className={`md:col-span-1 border rounded-lg overflow-hidden ${darkClasses.card} backdrop-blur-sm`}>
                  <div className="divide-y divide-white/20">
                    {filteredMessages.map(msg => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedComment(msg)}
                        className={`w-full text-left p-3 transition-colors group ${
                          selectedComment && selectedComment.id === msg.id 
                            ? (darkMode ? 'bg-blue-900' : 'bg-blue-50') 
                            : darkClasses.hover
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarBgClass(msg.email)}`}>
                            {getInitials(msg.name, msg.email)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <div className={`font-medium ${darkClasses.text} truncate`}>
                                {msg.name || 'Anonymous'}
                              </div>
                              <span className={`text-xs ${darkClasses.textMuted}`}>{formatDateTime(getLastActivity(msg))}</span>
                            </div>
                            <div className={`text-xs ${darkClasses.textMuted} truncate`}>{msg.email}</div>
                            <div className={`mt-1 ${darkClasses.text} truncate font-semibold`}>{msg.title}</div>
                            <div className={`mt-0.5 text-sm ${darkClasses.textSecondary} line-clamp-2`}>
                              {getLastThreadSnippet(msg.reply, msg.comments)}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${msg.replied ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {msg.replied ? 'Replied' : 'Unread'}
                              </span>
                              <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Conversation Pane */}
                <div className={`md:col-span-2 border rounded-lg p-0 ${darkClasses.card} overflow-hidden backdrop-blur-sm`}>
                  {!selectedComment ? (
                    <div className={`text-center ${darkClasses.textMuted} py-12`}>Select a message to view conversation</div>
                  ) : (
                    <div>
                      {/* Header */}
                      <div className={`px-4 py-3 border-b ${darkMode ? 'bg-gray-700/80 border-white/20' : 'bg-gray-50/80 border-white/20'} backdrop-blur-sm`}>
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <div className={`text-lg font-semibold ${darkClasses.text} truncate`}>{selectedComment.title}</div>
                            <div className={`text-sm ${darkClasses.textSecondary} truncate`}>{selectedComment.name || 'Anonymous'} • {selectedComment.email}</div>
                          </div>
                          <div className={`text-xs ${darkClasses.textMuted} ml-4 whitespace-nowrap`}>{formatDateTime(getLastActivity(selectedComment))}</div>
                        </div>
                      </div>

                      {/* Original message */}
                      <div className="p-4">
                        <div className="mb-4">
                          <div className={`text-xs font-medium ${darkClasses.textMuted} mb-1`}>Original Message</div>
                          <div className={`p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded`}>
                            <pre className={`whitespace-pre-wrap break-words text-sm ${darkClasses.text}`}>{selectedComment.comments}</pre>
                          </div>
                        </div>

                      {/* Thread */}
                      {selectedComment.reply && (() => {
                        const thread = parseReplyThread(selectedComment.reply, selectedComment.replied_at);
                        return (
                          <div className="space-y-3">
                            {thread.map((seg, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded border ${seg.role === 'admin' ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-medium ${seg.role === 'admin' ? 'text-blue-800' : 'text-yellow-800'}`}>
                                    {seg.role === 'admin' ? 'Admin' : 'User'}
                                  </span>
                                  <span className={`text-xs ${seg.role === 'admin' ? 'text-blue-600' : 'text-yellow-700'}`}>
                                    {seg.timestamp ? formatDateTime(seg.timestamp) : (seg.role === 'admin' ? formatDateTime(selectedComment.replied_at) : 'N/A')}
                                  </span>
                                </div>
                                <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{seg.text}</pre>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      </div>

                      {/* Actions */}
                      <div className={`px-4 pb-4 pt-2 border-t ${darkMode ? 'bg-gray-700/80 border-white/20' : 'bg-gray-50/80 border-white/20'} flex gap-2 backdrop-blur-sm`}>
                        <button
                          onClick={() => setReplyModalOpen(true)}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1.5 rounded"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete('comments', selectedComment.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-3 py-1.5 rounded border border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle email sending
  const handleSendEmail = async () => {
    if (!emailRecipient || !emailSubject.trim() || !emailMessage.trim()) {
      alert('Please fill in all email fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailRecipient.email,
          subject: emailSubject,
          message: emailMessage,
          recipientName: emailRecipient.name || emailRecipient.username
        })
      });

      if (!res.ok) throw new Error('Failed to send email');

      alert('Email sent successfully!');
      setEmailModalOpen(false);
      setEmailRecipient(null);
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.message}`);
    }
  };

  // Open email modal for specific recipient
  const openEmailModal = (recipient, defaultSubject = '') => {
    setEmailRecipient(recipient);
    setEmailSubject(defaultSubject);
    setEmailMessage('');
    setEmailModalOpen(true);
  };

  const renderVisitRequests = () => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'confirmed': return 'text-green-600 bg-green-100';
        case 'rejected': return 'text-red-600 bg-red-100';
        case 'cancelled': return 'text-gray-600 bg-gray-100';
        default: return 'text-blue-600 bg-blue-100';
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className={`${darkClasses.card} rounded-lg shadow-lg border ${darkClasses.border}`}>
          <div className="px-6 py-4">
            <h2 className={`text-xl font-semibold ${darkClasses.text}`}>
              Visit Requests Management
            </h2>
            <p className={`text-sm ${darkClasses.textMuted} mt-1`}>
              Monitor and manage all visit requests from users
            </p>
          </div>
        </div>


        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Requests', value: visitRequests.length, color: 'blue' },
            { label: 'Pending', value: visitRequests.filter(r => r.status === 'pending').length, color: 'yellow' },
            { label: 'Confirmed', value: visitRequests.filter(r => r.status === 'confirmed').length, color: 'green' },
            { label: 'Rejected', value: visitRequests.filter(r => r.status === 'rejected').length, color: 'red' }
          ].map((stat, index) => (
            <div key={index} className={`${darkClasses.card} rounded-lg shadow border ${darkClasses.border} p-4`}>
              <div className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className={`text-sm ${darkClasses.textMuted}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>


        {/* Visit Requests List */}
        <div className={`${darkClasses.card} rounded-lg shadow-lg border ${darkClasses.border}`}>
          <div className="px-6 py-4 border-b border-white/20">
            <h3 className={`text-lg font-medium ${darkClasses.text}`}>
              All Visit Requests ({visitRequests.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkClasses.tableHeader}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Requestor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkClasses.tableBody} divide-y ${darkClasses.divide}`}>
                {visitRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={`px-6 py-8 text-center ${darkClasses.textMuted}`}>
                      <div className="flex flex-col items-center">
                        <CalendarCheck size={48} className="mb-2 opacity-50" />
                        <p>No visit requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visitRequests.map((request) => (
                    <tr key={request.id} className={`${darkClasses.tableRow}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${darkClasses.text}`}>
                            {request.user_username || request.first_name || 'Unknown User'}
                          </div>
                          <div className={`text-sm ${darkClasses.textMuted}`}>
                            {request.user_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-medium ${darkClasses.text}`}>
                            {request.boarding_title || request.house_title}
                          </div>
                          <div className={`text-sm ${darkClasses.textMuted}`}>
                            {request.boarding_address || request.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${darkClasses.text}`}>
                            {request.owner_name}
                          </div>
                          <div className={`text-sm ${darkClasses.textMuted}`}>
                            {request.owner_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkClasses.text}`}>
                          {formatDate(request.requested_date)}
                        </div>
                        {request.requested_time && (
                          <div className={`text-xs ${darkClasses.textMuted}`}>
                            {request.requested_time}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${darkClasses.text} max-w-xs truncate`}>
                          {request.message || 'No message'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEmailModal(
                              { 
                                name: request.user_username || request.first_name, 
                                email: request.user_email 
                              },
                              `Regarding your visit request for ${request.boarding_title || request.house_title}`
                            )}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center"
                          >
                            <Mail size={12} className="mr-1" />
                            Email User
                          </button>
                          <button
                            onClick={() => openEmailModal(
                              { 
                                name: request.owner_name, 
                                email: request.owner_email 
                              },
                              `Regarding visit request for ${request.boarding_title || request.house_title}`
                            )}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center"
                          >
                            <Mail size={12} className="mr-1" />
                            Email Owner
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
      case 'visitRequests':
        return renderVisitRequests();
      case 'boarding':
        return renderBoardingHouses();
      case 'comments':
        return renderComments();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-transparent'}`}>
      {/* Sidebar */}
      <div className={`${darkClasses.sidebar} shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 mt-20">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-xl ${darkClasses.text} ${sidebarOpen ? 'block' : 'hidden'}`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg ${darkClasses.hover}`}
            >
              <Menu size={20} className={darkClasses.text} />
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
                className={`w-full flex items-center px-4 py-3 text-left transition-colors relative ${
                  activeSection === item.id ? darkClasses.sidebarActive : darkClasses.sidebarHover
                }`}
              >
                <Icon size={20} className={`${activeSection === item.id ? 'text-blue-600' : darkClasses.text}`} />
                <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} ${
                  activeSection === item.id ? 'text-blue-600 font-medium' : darkClasses.text
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

      {/* Main Content with Background Image and Overlay */}
      <div className="flex-1 overflow-auto relative">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Semi-transparent Overlay */}
        <div className={`absolute inset-0 z-10 backdrop-blur-lg ${
          darkMode ? 'bg-gray-900/70' : 'bg-white/30'
        }`} />
        
        {/* Content Container */}
        <div className="relative z-20 p-6 pt-40 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl font-bold ${darkClasses.text}`}>
              {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {selectedProfile && (
        selectedProfile.type === 'owner' ? (
          <OwnerModal 
            profile={selectedProfile} 
            onClose={() => setSelectedProfile(null)} 
          />
        ) : (
          <ProfileModal 
            profile={selectedProfile} 
            onClose={() => setSelectedProfile(null)} 
          />
        )
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

{/* Email Modal */}
<EmailModal
  isOpen={emailModalOpen}
  onClose={() => setEmailModalOpen(false)}
  recipient={emailRecipient}
  subject={emailSubject}
  setSubject={setEmailSubject}
  message={emailMessage}
  setMessage={setEmailMessage}
  onSend={handleSendEmail}
/>

    </div>
  );
};

// Email Modal Component
const EmailModal = ({ 
  isOpen, 
  onClose, 
  recipient, 
  subject,
  setSubject,
  message,
  setMessage,
  onSend,
  sending = false
}) => {
  if (!isOpen) return null;

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }
    onSend();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Mail className="mr-2" size={20} />
            Send Email
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {recipient && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">To:</div>
              <div className="font-medium">{recipient.name || recipient.username}</div>
              <div className="text-sm text-gray-600">{recipient.email}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;