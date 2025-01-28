import pickle
import numpy as np
from flask import jsonify

# Load the trained model
with open('models/HeartDisease.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

def predict_heart_disease(data):
    try:
        # Convert input data to numpy array
        input_data = np.array([
            float(data['gender']),
            float(data['age']),
            float(data['education']),
            float(data['currentSmoker']),
            float(data['cigsPerDay']),
            float(data['BPMeds']),
            float(data['prevalentStroke']),
            float(data['prevalentHyp']),
            float(data['diabetes']),
            float(data['totChol']),
            float(data['sysBP']),
            float(data['diaBP']),
            float(data['BMI']),
            float(data['heartRate']),
            float(data['glucose'])
        ]).reshape(1, -1)

        # Make prediction
        prediction = model.predict(input_data)
        probability = model.predict_proba(input_data)[0][1]

        return jsonify({
            'risk': int(prediction[0]),
            'probability': float(probability)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Example usage in your Flask route:
# @app.route('/predict/heart', methods=['POST'])
# def predict_heart():
#     data = request.json
#     return predict_heart_disease(data)

