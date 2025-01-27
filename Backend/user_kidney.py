import pickle
import numpy as np
import pandas as pd
from extract_kidney import extract_kidney_data

# Load the trained model
with open('models/KidneyDisease.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Print the feature names that the model expects
print("Model feature names:", model.feature_names_in_)

# Define the feature names based on what the model expects
feature_names = list(model.feature_names_in_)

def predict_kidney_func(pdf_path):
    # Extract features from the PDF
    extracted_features = extract_kidney_data(pdf_path)
    
    # Identify missing features and potentially incorrect values
    missing_features = []
    for feat in feature_names:
        if feat not in extracted_features or extracted_features[feat] is None:
            missing_features.append(feat)
    
    return {
        "extracted_data": extracted_features,
        "missing_features": missing_features
    }

def make_final_prediction(features):
    # Create a DataFrame with all required features
    features_df = pd.DataFrame([features])
    
    # Ensure all required features are present and in the correct order
    for feat in feature_names:
        if feat not in features_df.columns or pd.isna(features_df[feat].iloc[0]):
            if feat in ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']:
                features_df[feat] = 'normal'  # Use 'normal' as default for categorical features
            else:
                features_df[feat] = 0  # Use 0 as default for numerical features
    
    # Reorder columns to match the model's expected order
    features_df = features_df[feature_names]
    
    # Convert categorical variables to numerical
    categorical_features = ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
    for feat in categorical_features:
        if feat in features_df.columns:
            features_df[feat] = features_df[feat].map({'normal': 0, 'abnormal': 1, 'present': 1, 'notpresent': 0, 'yes': 1, 'no': 0, 'good': 0, 'poor': 1})
            features_df[feat] = features_df[feat].fillna(0)  # Fill NaN values with 0
    
    # Ensure all values are numerical
    for col in features_df.columns:
        features_df[col] = pd.to_numeric(features_df[col], errors='coerce').fillna(0)
    
    features_df = features_df.astype(float)
    
    # Make prediction
    prediction = model.predict(features_df)
    probability = model.predict_proba(features_df)[0][1]  # Probability of positive class
    
    return {
        "predic": int(prediction[0]),
        "probability": float(probability),
        "input_data": features_df.iloc[0].to_dict()
    }
