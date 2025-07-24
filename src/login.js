import React from 'react';
import './styles.css';
import image from './assets/image.png';
import logo from './assets/logo1.png';


function LoginPage() {
  return (
    <div className="login-page" style={{ backgroundImage: `url(${image})` }}>
      <nav className="navbar">
        <div className="logo">
          <span className="icon">
            <img src={logo}/>
            </span>
        </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Boardings</a>
          <a href="#">Contact</a>
          <a href="#">About</a>
          <button className="register-btn">Register</button>
        </div>
      </nav>

      <div className="login-box">
        <h2>Please login to sign in</h2>
        <div class="checkbox-row">
          <label><input type="checkbox" name="role" value="admin"/> Admin</label>
          <label><input type="checkbox" name="role" value="seeker"/> Boarding Seeker</label>
          <label><input type="checkbox" name="role" value="owner"/> Boarding Owner</label>
        </div>

        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="sign-in-btn">SIGN IN</button>
      </div>

      <footer className="footer">
        <div className="footer-left">
          <div className="logo">
            <span className="icon">📍</span> Smart Boarding Finder
          </div>
          <p>Smart boarding solutions for University & Business students</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        <div className="footer-center">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Boardings</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>

        <div className="footer-right">
          <h4>Contact</h4>
          <p>📧 smartbf@gmail.com</p>
          <p>📞 +94 77 394 9615</p>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
