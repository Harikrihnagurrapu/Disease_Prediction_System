import React, { useState } from "react";
import axios from "axios";
import "../../assets/styles/user-heart.css";

const UserHeart = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    education: "",
    currentSmoker: "",
    cigsPerDay: "",
    BPMeds: "",
    prevalentStroke: "",
    prevalentHyp: "",
    diabetes: "",
    totChol: "",
    sysBP: "",
    diaBP: "",
    BMI: "",
    heartRate: "",
    glucose: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/predict/heart`,
        formData
      );
      setPrediction(response.data);
    } catch (err) {
      setError("An error occurred while making the prediction.");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-heart-container">
      <h2>Heart Disease Risk Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Education Level:</label>
          <select
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Some High School</option>
            <option value="2">High School or GED</option>
            <option value="3">Some College or Vocational School</option>
            <option value="4">College</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currentSmoker">Current Smoker:</label>
          <select
            name="currentSmoker"
            value={formData.currentSmoker}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cigsPerDay">Cigarettes per Day:</label>
          <input
            type="number"
            name="cigsPerDay"
            value={formData.cigsPerDay}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="BPMeds">On Blood Pressure Medication:</label>
          <select
            name="BPMeds"
            value={formData.BPMeds}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="prevalentStroke">Previous Stroke:</label>
          <select
            name="prevalentStroke"
            value={formData.prevalentStroke}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="prevalentHyp">Hypertension:</label>
          <select
            name="prevalentHyp"
            value={formData.prevalentHyp}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="diabetes">Diabetes:</label>
          <select
            name="diabetes"
            value={formData.diabetes}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="totChol">Total Cholesterol (mg/dL):</label>
          <input
            type="number"
            name="totChol"
            value={formData.totChol}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sysBP">Systolic Blood Pressure (mmHg):</label>
          <input
            type="number"
            name="sysBP"
            value={formData.sysBP}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="diaBP">Diastolic Blood Pressure (mmHg):</label>
          <input
            type="number"
            name="diaBP"
            value={formData.diaBP}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="BMI">BMI:</label>
          <input
            type="number"
            name="BMI"
            value={formData.BMI}
            onChange={handleInputChange}
            required
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="heartRate">Heart Rate (bpm):</label>
          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="glucose">Glucose Level (mg/dL):</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="heart-submit" disabled={loading}>
          Predict Heart Disease Risk
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h3>Prediction Result:</h3>
          <p>
            {prediction.risk === 1
              ? "High risk of developing heart disease in the next 10 years."
              : "Low risk of developing heart disease in the next 10 years."}
          </p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default UserHeart;
