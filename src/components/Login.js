import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

 

function Login() {
  const [role, setRole] = useState(""); // Store selected radio value
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") {
      navigate("/register");
   } else if (role === "seeker") {
      navigate("/dashboard");
    } else if (role === "owner") {
      navigate("/owner")
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Please login to sign in</h2>
        <form onSubmit={handleSubmit}>
          {/* Radio Buttons */}
          <div className="checkbox-row">
            <label className="custom-radio">
              <input
                type="radio"
                name="role"
                value="admin"
                onChange={(e) => setRole(e.target.value)}
              />
              <span className="checkmark"></span>
              Admin
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="role"
                value="seeker"
                onChange={(e) => setRole(e.target.value)}
              />
              <span className="checkmark"></span>
              Boarding Seeker
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="role"
                value="owner"
                onChange={(e) => setRole(e.target.value)}
              />
              <span className="checkmark"></span>
              Boarding Owner
            </label>
          </div>

          {/* Inputs */}
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {/* Submit Button */}
          <button type="submit" className="sign-in-btn">SIGN IN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

