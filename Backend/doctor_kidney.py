import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder

# Load the trained model for kidney disease
with open('models/KidneyDisease.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Initialize LabelEncoder
le = LabelEncoder()

# Define the feature names that the model was trained on
MODEL_FEATURES = ['age', 'bp', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba', 'bgr', 'bu', 'sc', 'pot', 'wc', 'htn', 'dm', 'cad', 'pe', 'ane']

def predict_kidney_csv(csv_data):
    # Remove the first column (patient ID) and the 'classification' column if present
    patient_ids = csv_data.iloc[:, 0]
    features = csv_data.iloc[:, 1:]
    if 'classification' in features.columns:
        features = features.drop('classification', axis=1)
    
    # Select only the features that the model was trained on
    features = features[MODEL_FEATURES]
    
    # Preprocess the data
    for column in features.columns:
        if features[column].dtype == 'object':
            features[column] = le.fit_transform(features[column].astype(str))
    
    # Convert all columns to float
    features = features.astype(float)
    
    # Make predictions
    try:
        predictions = model.predict(features)
        probabilities = model.predict_proba(features)[:, 1]  # Probability of positive class
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return []
    
    results = []
    for i, patient_id in enumerate(patient_ids):
        results.append({
            'patientId': patient_id,
            'prediction': "Likely to have kidney disease" if predictions[i] == 1 else "Likely not to have kidney disease",
            'probability': float(probabilities[i])  # This is already a decimal between 0 and 1
        })
    
    return results
