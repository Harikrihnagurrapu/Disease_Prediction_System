import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder

# Load the trained model
with open('models/LiverDisease.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Initialize LabelEncoder
le = LabelEncoder()

def predict_liver_csv(csv_data):
    # Remove the first column (patient ID)
    features = csv_data.iloc[:, 1:]
    
    # Preprocess the data
    for column in features.columns:
        if features[column].dtype == 'object':
            features[column] = le.fit_transform(features[column])
    
    # Convert all columns to float
    features = features.astype(float)
    
    # Make predictions
    predictions = model.predict(features)
    probabilities = model.predict_proba(features)[:, 1]  # Probability of positive class
    
    results = []
    for i, (_, row) in enumerate(csv_data.iterrows()):
        results.append({
            'patientId': row.iloc[0],  # Assuming the first column is patient ID
            'prediction': "Likely to have liver disease" if predictions[i] == 1 else "Likely not to have liver disease",
            'probability': float(probabilities[i])
        })
    
    return results
