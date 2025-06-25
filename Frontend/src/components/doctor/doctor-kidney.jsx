import React, { useState, useRef } from "react";
import "../../assets/styles/doctor-liver.css";
import { CircularProgress } from "@mui/material";
import Papa from "papaparse";

const KidneyDiseasePrediction = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setResults([]);
      readCSV(selectedFile);
    } else {
      alert("Please select a valid CSV file.");
      e.target.value = null;
    }
  };

  const readCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResults([]);
    setCsvData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file to analyze.");
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/doctor/kidney`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.predictions) {
        const sortedPredictions = result.predictions.sort((a, b) => {
          if (a.prediction === b.prediction) {
            return b.probability - a.probability;
          }
          return a.prediction.includes("not") ? 1 : -1;
        });

        setResults(sortedPredictions);
      } else {
        throw new Error("No predictions received from the server");
      }
    } catch (error) {
      console.error("Error analyzing report:", error);
      alert("An error occurred while analyzing the report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prediction-content">
      <h1>Kidney Disease Prediction</h1>
      <div className="upload-card">
        <h2>Upload CSV Report</h2>
        <form onSubmit={handleSubmit}>
          <p>Select a CSV file</p>
          <div className="file-input-container">
            <label className="file-input-label" htmlFor="file-upload">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>
          {file && (
            <div className="uploaded-files">
              <h3>Uploaded File</h3>
              <ul>
                <li>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={handleRemoveFile}
                  >
                    ×
                  </button>
                </li>
              </ul>
            </div>
          )}
          <button className="analyze-button" type="submit">
            {isLoading ? "Analyzing..." : "Analyze Report"}
          </button>
        </form>
      </div>

      {csvData && (
        <div className="csv-preview">
          <h3>CSV File Preview</h3>
          <div className="csv-table-container">
            <table className="csv-table">
              <thead>
                <tr>
                  {Object.keys(csvData[0]).map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {csvData.length > 5 && (
            <p className="csv-info">
              Showing first 5 rows out of {csvData.length} total rows.
            </p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="loading-indicator">
          <CircularProgress size={40} thickness={4} />
          <p>Analyzing reports, please wait...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="result-container">
          <h3>Prediction Results</h3>
          <table className="prediction-table">
            <thead>
              <tr>
                <th>PATIENT ID</th>
                <th>PREDICTION</th>
                <th>PROBABILITY</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.patientId}</td>
                  <td
                    className={
                      result.prediction.includes("not")
                        ? "negative-prediction"
                        : "positive-prediction"
                    }
                  >
                    {result.prediction}
                  </td>
                  <td>{(result.probability * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KidneyDiseasePrediction;
