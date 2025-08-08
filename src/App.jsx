import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './pages/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import BoardingList from "./pages/BoardingList";
import BoardingDetail from "./pages/BoardingDetail";
import BookNow from "./pages/BookNow";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/boardinglist" element={<BoardingList />} />
        <Route path="/boarding/:id" element={<BoardingDetail />} />
        <Route path="/booknow/:id" element={<BookNow />} />
      </Routes>
    </Router>
  );
}

export default App;
