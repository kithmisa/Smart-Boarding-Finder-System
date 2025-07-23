// src/App.js
// App.js
// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import BoardingList from "./BoardingList";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Boarding Finder</h1>
      <button onClick={() => navigate("/per-day")} style={{ marginRight: "20px" }}>
        Show Per Day Rooms
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/per-day" element={<BoardingList />} />
      </Routes>
    </Router>
  );
}

export default App;
