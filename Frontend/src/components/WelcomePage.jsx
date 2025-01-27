import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/WelcomePage.css";

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to HealthPredict</h1>
        <p className="subtitle">AI-powered health predictions at your fingertips</p>
        <div className="login-options">
          <Link to="/user/login" className="login-option user">
            <div className="login-icon">
              <img src="/user-logo.png" alt="User" />
            </div>
            <p>I'm a User</p>
          </Link>
          <Link to="/doctor/login" className="login-option doctor">
            <div className="login-icon">
              <img src="/doctor-logo.png" alt="Doctor" />
            </div>
            <p>I'm a Doctor</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;