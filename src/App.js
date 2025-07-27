import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'; // ✅ Added Outlet here
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Login from './components/Login';
import BoardingList from './components/BoardingList';
import RegisterForm from './components/RegisterForm';
import Contact from './components/Contact';
import AddBoardingForm from './components/AddBoardingForm';
import OwnerDashboard from './components/OwnerDashboard';
import Dashboard from './components/Dashboard';

import './App.css';


function Layout() {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <ScrollToTop />
      <Outlet /> {/* ✅ this will render child routes */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Layout route */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="boarding" element={<BoardingList />} />
        <Route path="contact" element={<Contact />} />
         <Route path="addboarding" element={<AddBoardingForm />} />
         <Route path="owner" element={<OwnerDashboard />} />
           <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
