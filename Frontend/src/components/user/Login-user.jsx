import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../assets/styles/Login.css";

function LoginPage() {
  return (
    <div id="main">
      <div id="navbar">
        {/* Use Link instead of a tag for React navigation */}
        <Link to="/" id="nav-items">Home</Link>
        <Link to="/doctor/login" id="nav-items">
          Doctor Login
        </Link>
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-icon">
            <img
              src="/user-logo.png"
              alt="login icon"
            />
          </div>
          <h2 id="member-title">User Login</h2>
          <form>
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" required />
            </div>
            <Link to="/user/dashboard"><button type="submit" className="login-btn">
              LOGIN
            </button></Link>
          </form>
          <div className="footer-links">
            <Link to="/forgot">Forgot Username / Password?</Link>
            <Link to="/register">Create your Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
