import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardingList from "./BoardingList";
import BoardingDetail from "./BoardingDetail";
import BookNow from "./BookNow"; // make sure the path is correct


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardingList />} />
        <Route path="/boarding/:id" element={<BoardingDetail />} />
        <Route path="/booknow/:id" element={<BookNow />} />

      </Routes>
    </Router>
  );
}

export default App;
