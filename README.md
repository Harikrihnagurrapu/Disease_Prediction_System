# Disease Prediction System

This is a full-stack web application designed to predict the likelihood of several common diseases based on user-provided medical data. It uses machine learning models served via a Flask backend and provides a user-friendly interface built with React.

The application supports two distinct user roles: **Users** (patients) and **Doctors**, each with tailored functionalities.

## Live Demo

- **Frontend (Vercel):** [https://disease-prediction-system-coral.vercel.app/](https://disease-prediction-system-coral.vercel.app/)
- **Backend (Render):** [https://disease-prediction-system-0xui.onrender.com](https://disease-prediction-system-0xui.onrender.com)

---

## Features

### For Users (Patients)

- **Heart Disease Prediction:** Manually input health metrics (e.g., age, cholesterol, blood pressure) into a form to receive an instant risk prediction.
- **Liver Disease Prediction:** Upload a medical report in PDF format to automatically extract relevant values and predict the likelihood of liver disease.
- **Kidney Disease Prediction:** Upload a PDF medical report. The system extracts all possible data and, if any features are missing, presents a form for the user to fill in the remaining values to get a final, accurate prediction.

### For Doctors

- **Batch Prediction from CSV:** Upload a CSV file containing data for multiple patients to receive batch predictions for:
  - Heart Disease
  - Kidney Disease
  - Liver Disease
- **Efficient Data Processing:** Results are displayed in a clear, tabular format, showing predictions and probabilities for each patient in the uploaded file.

---

## Technology Stack

- **Frontend:**
  - **Framework:** React (with Vite)
  - **Routing:** React Router
  - **HTTP Client:** Axios & Fetch API
  - **Styling:** CSS
- **Backend:**
  - **Framework:** Flask
  - **WSGI Server:** Gunicorn
  - **Machine Learning:** Scikit-learn, XGBoost
  - **Data Handling:** Pandas, NumPy
  - **PDF Processing:** PDFPlumber
- **Deployment:**
  - **Frontend:** Vercel
  - **Backend:** Render

---

## Getting Started (Local Development)

To run this project on your local machine, please follow the steps below.

### Prerequisites

- Node.js and npm (for Frontend)
- Python and pip (for Backend)

### Backend Setup

1.  **Navigate to the Backend Directory:**
    ```bash
    cd Backend
    ```
2.  **Create and Activate a Virtual Environment:**

    ```bash
    # Create the environment
    python -m venv venv

    # Activate on Windows
    .\venv\Scripts\activate

    # Activate on macOS/Linux
    source venv/bin/activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Flask Server:**
    ```bash
    python app.py
    ```
    The backend will now be running at `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd Frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Create Environment File:**
    Create a new file named `.env.local` in the `Frontend` directory and add the following line. This tells the frontend to connect to your local backend server.
    ```
    VITE_API_URL=http://localhost:5000
    ```
4.  **Run the React Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will now be accessible at `http://localhost:5173` (or another port if 5173 is busy).

---

