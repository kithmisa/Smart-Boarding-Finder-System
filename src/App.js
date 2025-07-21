
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';


function App() {
  return (
      <><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />


    </Routes><div className="bg-gray-100">
        <Navbar />
        <Footer />
      </div></>
  );
}

export default App