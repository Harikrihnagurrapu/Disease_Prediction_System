import pickle
import numpy as np
from extract import extract_medical_data

# Load the model
def predict_liver_func(file):
    with open('models/LiverDisease.pkl', 'rb') as model_file:
        liver_model = pickle.load(model_file)

    input_data = extract_medical_data(file)

    def predict_liver_disease(input_data):
        input_array = np.array(input_data).reshape(1, -1)
        prediction = liver_model.predict(input_array)[0]
        probability = liver_model.predict_proba(input_array)[0]
        
        return {
            "predict": int(prediction),
            "probability": float(probability[1]),
            "input_data": input_data
        }

    return predict_liver_disease(input_data)
