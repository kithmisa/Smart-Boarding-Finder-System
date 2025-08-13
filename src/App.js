import React, { useState } from 'react';

import { Routes, Route, Outlet } from 'react-router-dom'; // ✅ Added Outlet here
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
//import AdminLogin from './components/AdminLogin';

import FloatingAdminIcon from './components/FloatingAdminIcon';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import './App.css';


function Layout() {
  return (
    <div className="app-container bg-gray-100">
      <Navbar />
      
      <ScrollToTop />
      <div className="app-content">
      <Outlet /> {/* ✅ this will render child routes */}
     </div>
      <Footer />
    </div>
  );
}

function App() {

   const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
    <Routes>
      {/* Layout route */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={<OwnerDetails />} />
         <Route path="register/house" element={<HouseDetails />} />
         <Route path="register/house/payment" element={<Payment />} />
       
        <Route path="boarding" element={<BoardingList />} />
         <Route path="/boarding/:id" element={<BoardingDetail />} />
        <Route path="contact" element={<Contact />} />
         <Route path="admin-dashboard" element={<AdminDashboard />} /> 
      
      </Route>
      
    </Routes>
    <FloatingAdminIcon />

     <FloatingAdminIcon onClick={() => setShowAdminLogin(true)} />

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}

    </>
  );
}

export default App;
