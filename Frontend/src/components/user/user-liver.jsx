import React, { useState, useRef, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import "../../assets/styles/user-liver.css";

const LiverDiseasePrediction = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
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
    setResult(null);
    setDebugInfo(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/liver`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);
      setDebugInfo(JSON.stringify(data, null, 2));

      setResult({
        fileName: file.name,
        prediction: data.prediction.predic, // Changed from 'prediction' to 'predic'
        probability: data.prediction.probability,
        inputData: data.prediction.input_data,
      });
    } catch (error) {
      console.error("Error analyzing report:", error);
      setDebugInfo(error.toString());
      alert("An error occurred while analyzing the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const inputDataLabels = [
    "Total Bilirubin",
    "Direct Bilirubin",
    "Alkaline Phosphotase",
    "Alamine Aminotransferase",
    "Aspartate Aminotransferase",
    "Total Proteins",
    "Albumin",
    "Albumin and Globulin Ratio",
  ];

  const nominalValues = [
    "0.1 - 1.2 mg/dL",
    "0 - 0.3 mg/dL",
    "20 - 140 U/L",
    "7 - 56 U/L",
    "10 - 40 U/L",
    "6.0 - 8.3 g/dL",
    "3.5 - 5.5 g/dL",
    "1.0 - 2.5",
  ];

  const isOutOfRange = (value, index) => {
    if (value === null || value === undefined) return false;
    const [min, max] = nominalValues[index]
      .split(" - ")
      .map((v) => parseFloat(v));
    return value < min || value > max;
  };

  const formatInputValue = (value, index) => {
    if (index === 1) {
      // Gender
      return value === 0 ? "Male" : "Female";
    }
    return value !== null && value !== undefined ? value : "N/A";
  };

  const formatGender = (value) => {
    return value === 0 ? "Male" : "Female";
  };

  const formatPredictionText = (prediction, probability) => {
    if (probability < 0.4) {
      return "No liver disease";
    } else if (probability < 0.6) {
      return "Low risk of liver disease";
    } else if (probability < 0.8) {
      return "High risk of liver disease";
    } else {
      return "Liver disease detected";
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
      <h1>Liver Disease Prediction</h1>
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

      {result && (
        <div className="result-container">
          <h3>Patient Information</h3>
          <div className="patient-info">
            <p>
              <strong>Age:</strong> {result.inputData[0]}
            </p>
            <p>
              <strong>Gender:</strong> {formatGender(result.inputData[1])}
            </p>
          </div>

          <h3>Prediction Result</h3>
          <table className="prediction-table">
            <thead>
              <tr>
                <th>FILE NAME</th>
                <th>PREDICTION</th>
                <th>PROBABILITY</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.fileName}</td>
                <td className={getPredictionClass(result.probability)}>
                  {formatPredictionText(result.prediction, result.probability)}
                </td>
                <td>{formatProbability(result.probability)}</td>
              </tr>
            </tbody>
          </table>

          {result.inputData && result.inputData.length > 2 && (
            <div className="input-data-container">
              <h4>Input Data</h4>
              <table className="input-data-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Normal Range</th>
                  </tr>
                </thead>
                <tbody>
                  {inputDataLabels.map((label, index) => (
                    <tr key={index}>
                      <td>{label}</td>
                      <td>
                        {isOutOfRange(result.inputData[index + 2], index) ? (
                          <strong>
                            {result.inputData[index + 2] !== null &&
                            result.inputData[index + 2] !== undefined
                              ? result.inputData[index + 2]
                              : "N/A"}
                          </strong>
                        ) : result.inputData[index + 2] !== null &&
                          result.inputData[index + 2] !== undefined ? (
                          result.inputData[index + 2]
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{nominalValues[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p>
            <strong>Recommendation:</strong>{" "}
            {getRecommendation(result.prediction, result.probability)}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiverDiseasePrediction;
