import React, { useState } from 'react';

import { Routes, Route, Outlet } from 'react-router-dom'; // ✅ Added Outlet here
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import LoginSignUp from './components/LoginSignUp';
//import Login from './components/Login';
import BoardingList from './components/BoardingList';
//import RegisterForm from './components/RegisterForm';
import Contact from './components/Contact';
import AddBoardingForm from './components/AddBoardingForm';
import OwnerDashboard from './components/OwnerDashboard';
import Dashboard from './components/Dashboard';
import OwnerDetails from './components/OwnerDetails';
import HouseDetails from './components/HouseDetails';
import Payment from './components/Payment';
import BoardingDetail from './components/BoardingDetail'; 
//import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FloatingAdminIcon from './components/FloatingAdminIcon';
import AdminLoginModal from './components/AdminLoginModal';
import MyListings from './components/MyListings';
import EditHouse from './components/EditHouse';


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
       {/* <Route path="register" element={<RegisterForm />} />*/}
        <Route path="boarding" element={<BoardingList />} />
         <Route path="/boarding/:id" element={<BoardingDetail />} />
        <Route path="contact" element={<Contact />} />
         <Route path="addboarding" element={<AddBoardingForm />} />
         <Route path="owner" element={<OwnerDashboard />} />
           <Route path="dashboard" element={<Dashboard />} />
        {/*  <Route path="/admin-login" element={<AdminLogin />} />*/}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/owner/listings" element={<MyListings />} />
        <Route path="/owner/edit/:id" element={<EditHouse />} />



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
