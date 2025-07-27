import React from 'react';
import './styles.css';
import image from './assets/image.png';
import logo from './assets/logo1.png';


function LoginPage() {
  return (
    // <div className="login-page" >

      

    // </div>
    <div className=" pt-20 pb-20" style={{
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // height: '100vh', // Make sure the container fills the screen height
    width: '100%'    // Optional: ensure full width
  }}>
    <div className="login-box">
       <h2 className="text-2xl font-bold mb-4">Please login to sign in</h2>

        <div class="checkbox-row">
          <label><input type="radio" name="role" value="admin"/> Admin</label>
          <label><input type="radio" name="role" value="seeker"/> Boarding Seeker</label>
          <label><input type="radio" name="role" value="owner"/> Boarding Owner</label>
        </div>

        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="sign-in-btn">SIGN IN</button>
      </div>
      </div>
  );
}

export default LoginPage;
