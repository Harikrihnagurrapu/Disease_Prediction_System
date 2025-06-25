import React, { useState, useRef, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import "../../assets/styles/user-liver.css";

const KidneyDiseasePrediction = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [missingFeatures, setMissingFeatures] = useState([]);
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      console.error("Render Error:", error);
    }
  }, [error]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null); // Reset result when a new file is selected
  };

  const formatProbability = (prob) => {
    console.log("Raw probability:", prob);
    if (typeof prob === "number" && !isNaN(prob)) {
      return `${(prob * 100).toFixed(2)}%`;
    }
    return "N/A";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to analyze.");
      return;
    }

    setIsLoading(true);
    setExtractedData(null);
    setMissingFeatures([]);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/kidney`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExtractedData(data.extracted_data);
      setMissingFeatures(data.missing_features);
    } catch (error) {
      console.error("Error analyzing report:", error);
      setError(
        "An error occurred while analyzing the report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (feature, value) => {
    const numericFeatures = [
      "age",
      "bp",
      "sg",
      "al",
      "su",
      "bgr",
      "bu",
      "sc",
      "sod",
      "pot",
      "hemo",
      "pcv",
      "wc",
      "rc",
    ];
    const categoricalFeatures = [
      "rbc",
      "pc",
      "pcc",
      "ba",
      "htn",
      "dm",
      "cad",
      "appet",
      "pe",
      "ane",
    ];

    if (numericFeatures.includes(feature)) {
      return (
        !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0
      );
    } else if (categoricalFeatures.includes(feature)) {
      return [
        "normal",
        "abnormal",
        "present",
        "notpresent",
        "yes",
        "no",
        "good",
        "poor",
      ].includes(value.toLowerCase());
    }
    return true;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const finalFeatures = { ...extractedData };
      let hasValidationError = false;

      missingFeatures.forEach((feature) => {
        const value = e.target[feature].value;
        if (!validateInput(feature, value)) {
          setError(`Invalid input for ${feature}`);
          hasValidationError = true;
          return;
        }
        finalFeatures[feature] = value;
      });

      if (hasValidationError) {
        setIsLoading(false);
        return;
      }

      // Ensure 'appet' is included
      if (!finalFeatures.hasOwnProperty("appet")) {
        finalFeatures["appet"] = "normal";
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/kidney/final`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ features: finalFeatures }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.predic);
      setProbability(data.probability);
    } catch (error) {
      console.error("Error making final prediction:", error);
      setError(
        "An error occurred while making the final prediction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const inputDataLabels = [
    "Age",
    "Blood Pressure",
    "Specific Gravity",
    "Albumin",
    "Sugar",
    "Red Blood Cells",
    "Pus Cell",
    "Pus Cell Clumps",
    "Bacteria",
    "Blood Glucose Random",
    "Blood Urea",
    "Serum Creatinine",
    "Sodium",
    "Potassium",
    "Hemoglobin",
    "Packed Cell Volume",
    "White Blood Cell Count",
    "Red Blood Cell Count",
    "Hypertension",
    "Diabetes Mellitus",
    "Coronary Artery Disease",
    "Appetite",
    "Pedal Edema",
    "Anemia",
  ];

  const nominalValues = [
    "N/A",
    "90-120/60-80 mmHg",
    "1.005-1.025",
    "< 30 mg/dL",
    "< 130 mg/dL",
    "4.5-5.5 million/mm³",
    "0-5 /HPF",
    "Absent",
    "Not present",
    "70-100 mg/dL",
    "7-20 mg/dL",
    "0.6-1.2 mg/dL",
    "135-145 mEq/L",
    "3.5-5.0 mEq/L",
    "13.5-17.5 g/dL",
    "40-50%",
    "4,500-11,000 /mm³",
    "4.5-5.5 million/mm³",
    "No",
    "No",
    "No",
    "Good",
    "Absent",
    "No",
  ];

  const isOutOfRange = (value, index) => {
    if (value === null || value === undefined) return false;
    if (index === 0) return false; // Age
    if (index >= 18) return false; // Binary features
    const range = nominalValues[index].split("-").map((v) => parseFloat(v));
    return value < range[0] || value > range[1];
  };

  const formatInputValue = (value, index) => {
    if (index >= 18) {
      // Binary features
      return value === 1 ? "Yes" : "No";
    }
    return value !== null && value !== undefined ? value : "N/A";
  };

  const formatPredictionText = (prediction, probability) => {
    if (probability < 0.4) {
      return "No kidney disease";
    } else if (probability < 0.6) {
      return "Low risk of kidney disease";
    } else if (probability < 0.8) {
      return "High risk of kidney disease";
    } else {
      return "Kidney disease detected";
    }
  };

  const getPredictionClass = (probability) => {
    if (probability < 0.4) return "negative-prediction";
    if (probability < 0.6) return "uncertain-prediction";
    if (probability < 0.8) return "possible-prediction";
    return "positive-prediction";
  };

  const getRecommendation = (prediction, probability) => {
    if (prediction === 1) {
      return "Immediate medical attention recommended";
    } else {
      if (probability < 0.4) {
        return "No further action needed";
      } else if (probability < 0.6) {
        return "Consider lifestyle changes and regular check-ups";
      } else {
        return "Further tests and medical consultation recommended";
      }
    }
  };

  return (
    <div className="prediction-content">
      <h1>Kidney Disease Prediction</h1>
      <div className="upload-card">
        <h2>Upload Blood Report</h2>
        <form onSubmit={handleSubmit}>
          <p>Select a PDF file</p>
          <div className="file-input-container">
            <label className="file-input-label" htmlFor="file-upload">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>
          {file && <p className="file-name">{file.name}</p>}
          <button className="analyze-button" type="submit" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Report"}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <CircularProgress size={40} thickness={4} />
          <p>Analyzing report, please wait...</p>
        </div>
      )}

      {extractedData && missingFeatures.length > 0 && (
        <div className="missing-features-form">
          <h3>Please provide the following missing information:</h3>
          <form onSubmit={handleFinalSubmit}>
            {missingFeatures.map((feature) => (
              <div key={feature}>
                <label htmlFor={feature}>{feature}:</label>
                {[
                  "rbc",
                  "pc",
                  "pcc",
                  "ba",
                  "htn",
                  "dm",
                  "cad",
                  "appet",
                  "pe",
                  "ane",
                ].includes(feature) ? (
                  <select id={feature} name={feature} required>
                    <option value="">Select</option>
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="present">Present</option>
                    <option value="notpresent">Not Present</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="good">Good</option>
                    <option value="poor">Poor</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    id={feature}
                    name={feature}
                    required
                    step="any"
                    min="0"
                  />
                )}
              </div>
            ))}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {result !== null && (
        <div>
          <h3>Prediction Result:</h3>
          <p>
            The model predicts:{" "}
            {result === 1
              ? "Chronic Kidney Disease"
              : "No Chronic Kidney Disease"}
          </p>
          <p>
            Probability of Chronic Kidney Disease:{" "}
            {(probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default KidneyDiseasePrediction;
