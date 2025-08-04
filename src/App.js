import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardingList from "./BoardingList";
import BoardingDetail from "./BoardingDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardingList />} />
        <Route path="/boarding/:id" element={<BoardingDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
