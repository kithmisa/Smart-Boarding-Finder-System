import React, { useState, useEffect } from 'react';

import { Routes, Route, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'; // add Navigate
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';

import BoardingList from './components/BoardingList';

import Contact from './components/Contact';
import OwnerDetails from './components/OwnerDetails';
import HouseDetails from './components/HouseDetails';
import Payment from './components/Payment';
import BoardingDetail from './components/BoardingDetail'; 
import ResetPassword from './components/ResetPassword';
import FloatingAdminIcon from './components/FloatingAdminIcon';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/auth/AuthModal';
import UserProfile from './components/UserProfile';
import './App.css';


function Layout({ onAuthClick, showAuthModal, onAuthClose, onAuthSuccess, isAuthenticated, user, onLogout }) {
  const location = useLocation();
  
  // Close AuthModal when route changes
  useEffect(() => {
    if (showAuthModal) {
      onAuthClose();
    }
  }, [location.pathname]);

  return (
    <div className="app-container bg-gray-100">
      <Navbar 
        onAuthClick={onAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />
      
      <ScrollToTop />
      <div className="app-content" style={{ display: showAuthModal ? 'none' : 'block' }}>
        <Outlet />
      </div>

      {/* Auth Modal sits between navbar and footer */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={onAuthClose}
          onAuthSuccess={onAuthSuccess}
        />
      )}

      <Footer isAuthenticated={isAuthenticated} user={user} />
    </div>
  );
}

function App() {

   const [showAdminLogin, setShowAdminLogin] = useState(false);
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [pendingNavigation, setPendingNavigation] = useState(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);

   // Check authentication status on mount
   useEffect(() => {
     const hasAuthedFlag = localStorage.getItem('has_authed');
     const authToken = localStorage.getItem('auth_token');
     
     console.log('🔍 Auth check on mount:', { hasAuthedFlag, authToken });
     
     if (hasAuthedFlag === '1' && authToken) {
       setIsAuthenticated(true);
       // You can decode the token here to get user info
       // For now, we'll set a basic user object
       setCurrentUser({
         firstName: 'User',
         email: 'user@example.com',
         // Add more user fields as needed
       });
       console.log('✅ User authenticated on mount');
     } else {
       console.log('❌ User not authenticated on mount');
     }
   }, []);

   const handleAuthClick = () => {
     setShowAuthModal(true);
   };

   const handleAuthClose = () => {
     setShowAuthModal(false);
     setPendingNavigation(null);
   };

   const handleAuthSuccess = (authData) => {
     console.log('🎉 Auth success:', authData);
     
     setIsAuthenticated(true);
     setCurrentUser(authData.user);
     
     // Store user ID in localStorage for profile navigation
     if (authData.user && authData.user.id) {
       localStorage.setItem('user_id', authData.user.id.toString());
       console.log('💾 Stored user_id:', authData.user.id);
     }
     
     setShowAuthModal(false);
     
     if (pendingNavigation) {
       console.log('🔄 Navigating to pending route:', pendingNavigation);
       window.location.href = pendingNavigation;
       setPendingNavigation(null);
     }
   };

   const handleLogout = () => {
     setIsAuthenticated(false);
     setCurrentUser(null);
     localStorage.removeItem('has_authed');
     localStorage.removeItem('auth_token');
     localStorage.removeItem('user_id');
   };

   const setPendingNav = (path) => {
     if (!isAuthenticated) {
       setPendingNavigation(path);
       setShowAuthModal(true);
     } else {
       window.location.href = path;
     }
   };

   useEffect(() => {
     window.setPendingNavigation = setPendingNav;
     return () => {
       delete window.setPendingNavigation;
     };
   }, [isAuthenticated]);

   // Wrapper that triggers auth flow in an effect (avoids render loops)
   const RequireAuth = ({ children }) => {
     const location = useLocation();
     
     // Check if user has authentication tokens in localStorage
     const hasAuthToken = !!localStorage.getItem('auth_token');
     const hasAuthedFlag = localStorage.getItem('has_authed') === '1';
     
     console.log('🔒 RequireAuth check:', { 
       pathname: location.pathname, 
       isAuthenticated, 
       hasAuthToken,
       hasAuthedFlag
     });
     
     // If we have tokens but state is not set, restore authentication state
     useEffect(() => {
       if (hasAuthToken && hasAuthedFlag && !isAuthenticated) {
         console.log('🔄 Restoring authentication state from localStorage');
         setIsAuthenticated(true);
         setCurrentUser({
           firstName: 'User',
           email: 'user@example.com',
         });
       } else if (!hasAuthToken || !hasAuthedFlag) {
         console.log('🚫 User not authenticated, setting pending navigation:', location.pathname);
         setPendingNavigation(location.pathname);
         setShowAuthModal(true);
       }
     }, [hasAuthToken, hasAuthedFlag, isAuthenticated, location.pathname]);
     
     // Only redirect if we don't have authentication tokens
     if (!hasAuthToken || !hasAuthedFlag) {
       console.log('↪️ Redirecting to home - no auth tokens');
       return <Navigate to="/" replace />;
     }
     
     console.log('✅ User authenticated, rendering protected content');
     return children;
   };

  return (
    <>
    <Routes>
              <Route path="/" element={
          <Layout 
            onAuthClick={handleAuthClick}
            showAuthModal={showAuthModal}
            onAuthClose={handleAuthClose}
            onAuthSuccess={handleAuthSuccess}
            isAuthenticated={isAuthenticated}
            user={currentUser}
            onLogout={handleLogout}
          />
        }>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={<OwnerDetails />} />
         <Route path="register/house" element={<HouseDetails />} />
         <Route path="register/house/payment" element={<Payment />} />
        <Route path="boarding" element={<BoardingList />} />
         <Route path="/boarding/:id" element={<RequireAuth><BoardingDetail /></RequireAuth>} />
         <Route path="/profile/:userId" element={<RequireAuth><UserProfile onLogout={handleLogout} /></RequireAuth>} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} /> 
      
      </Route>
      
    </Routes>
    
    <FloatingAdminIcon onClick={() => setShowAdminLogin(true)} />

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}


    </>
  );
}

export default App;
