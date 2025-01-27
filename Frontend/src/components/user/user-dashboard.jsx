import React, { useState } from "react";
import "../../assets/styles/user-dashboard.css";
import LiverDiseasePrediction from "./user-liver";
import HeartDiseasePrediction from "./user-heart";
import KidneyDiseasePrediction from "./user-kidney";

const UserDashboard = () => {
  const [selectedDisease, setSelectedDisease] = useState("liver");

  const renderPredictionComponent = () => {
    switch (selectedDisease) {
      case "liver":
        return <LiverDiseasePrediction />;
      case "heart":
        return <HeartDiseasePrediction />;
      case "kidney":
        return <KidneyDiseasePrediction />;
      default:
        return <LiverDiseasePrediction />; // Fallback to liver prediction
    }
  };

  return (
    <div className="disease-prediction-dashboard">
      <nav className="disease-nav">
        <h2>Disease Prediction</h2>
        <ul>
          {["liver", "heart", "kidney"].map((disease) => (
            <li key={disease}>
              <button
                className={selectedDisease === disease ? "active" : ""}
                onClick={() => setSelectedDisease(disease)}
              >
                {disease.charAt(0).toUpperCase() + disease.slice(1)} Disease
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="main-content">
        {renderPredictionComponent()}
      </div>
    </div>
  );
};

export default UserDashboard;
