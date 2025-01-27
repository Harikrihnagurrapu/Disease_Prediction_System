import React from "react";
import { Link } from "react-router-dom"; // Use Link for internal navigation
import "../../assets/styles/Login.css";

function Logi() {
  return (
    <div id="main">
      <div id="navbar">
        {/* Use Link for navigation to avoid page reload */}
        <Link to="/" id="nav-items">Home</Link>
        <Link to="/user/login" id="nav-items">User Login</Link>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-icon">
            {/* Ensure the image path is correct */}
            <img src="/doctor-logo.png"alt="login icon" />
          </div>
          <h2 id="member-title">Doctor Login</h2>
          <form>
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" required />
            </div>
            <Link to="/doctor/dashboard"><button type="submit" className="login-btn">
              LOGIN
            </button></Link>
          </form>
          <div className="footer-links">
            {/* Use Link for internal navigation */}
            <Link to="/forgot">Forgot Username / Password?</Link>
            <Link to="/register">Create your Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logi;
