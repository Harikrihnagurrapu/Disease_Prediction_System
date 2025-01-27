import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
import traceback

# Load the trained model for heart disease
try:
    with open('models/HeartDisease.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
    print("Heart disease model loaded successfully")
    if hasattr(model, 'feature_names_in_'):
        print("Model features:", model.feature_names_in_.tolist())
    else:
        print("Model doesn't have feature_names_in_ attribute")
except Exception as e:
    print(f"Error loading heart disease model: {str(e)}")
    model = None

# Initialize LabelEncoder
le = LabelEncoder()

# Define the feature names that are in your input CSV
CSV_FEATURES = ['age', 'education', 'currentSmoker', 'cigsPerDay', 'BPMeds', 'prevalentStroke', 'prevalentHyp', 'diabetes', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']

def predict_heart_csv(csv_data):
    try:
        # Remove the first column (patient ID) and the 'TenYearCHD' column if present
        patient_ids = csv_data.iloc[:, 0]
        features = csv_data.iloc[:, 1:]
        if 'TenYearCHD' in features.columns:
            features = features.drop('TenYearCHD', axis=1)
        
        print("Original feature names:", features.columns.tolist())
        
        # Select only the features that we expect in the CSV
        features = features[CSV_FEATURES]
        
        # Create 'male' feature (assuming it's not directly available)
        # You may need to adjust this based on your data
        features['male'] = 1  # Assuming all are male, adjust if you have this information
        
        # Ensure all required features are present
        required_features = model.feature_names_in_.tolist() if hasattr(model, 'feature_names_in_') else []
        for feature in required_features:
            if feature not in features.columns:
                features[feature] = 0  # Add missing features with default value 0
        
        # Select only the features the model expects
        features = features[required_features]
        
        print("Final feature names:", features.columns.tolist())
        
        # Preprocess the data
        for column in features.columns:
            if features[column].dtype == 'object':
                features[column] = le.fit_transform(features[column].astype(str))
        
        # Convert all columns to float
        features = features.astype(float)
        
        print("Feature types after preprocessing:")
        print(features.dtypes)
        
        print("First few rows of preprocessed features:")
        print(features.head())
        
        # Make predictions
        if model is None:
            raise ValueError("Heart disease model not loaded")
        
        predictions = model.predict(features)
        probabilities = model.predict_proba(features)[:, 1]  # Probability of positive class
        
        results = []
        for i, patient_id in enumerate(patient_ids):
            results.append({
                'patientId': patient_id,
                'prediction': "Likely to have heart disease" if predictions[i] == 1 else "Likely not to have heart disease",
                'probability': float(probabilities[i])
            })
        
        return results
    except Exception as e:
        print(f"Error during heart disease prediction: {str(e)}")
        print(traceback.format_exc())
        return []
