import pickle
from flask import render_template, request

def doctor_kidney():
    if request.method == 'POST':
        # Load the trained model
        with open('kidneydisease.pkl', 'rb') as model_file:
            model = pickle.load(model_file)
        
        # Get input values from the form
        input_data = [float(request.form[feature]) for feature in feature_names]
        
        # Make prediction
        prediction = model.predict([input_data])[0]
        
        result = "You may have chronic kidney disease." if prediction == 1 else "You may not have chronic kidney disease."
        
        return render_template('kidney.html', prediction=result)

    return render_template('kidney.html')
