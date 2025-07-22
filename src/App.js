
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';

import './App.css';


function App() {
  return (
     <><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
         <Route path="/about" element={<About />} />


    </Routes><div className="bg-gray-100">
        <Navbar />
        <Footer />
         <ScrollToTop />
      </div></>



  );
}

export default App;