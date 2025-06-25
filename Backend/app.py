from flask import Flask, request, jsonify
from flask_cors import CORS
from user_liver import predict_liver_func  # For PDF
from user_kidney import predict_kidney_func, make_final_prediction
from doctor_liver import predict_liver_csv
from doctor_kidney import predict_kidney_csv  # Add this import
from doctor_heart import predict_heart_csv  # Add this import
from user_heart import predict_heart_disease  # Add this import
import pandas as pd
import io
import traceback
import sys
import os

app = Flask(__name__)
CORS(app)

# Create a 'temp' directory if it doesn't exist
temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
os.makedirs(temp_dir, exist_ok=True)

# Existing endpoint for PDF (liver)
@app.route('/user/liver', methods=['POST'])
def predict_liver():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.pdf'):
        prediction = predict_liver_func(file)
        return jsonify({'prediction': prediction})
    else:
        return jsonify({'error': 'Invalid file type. Please upload a PDF.'}), 400

# Endpoint for CSV (liver)
@app.route('/doctor/liver', methods=['POST'])
def predict_liver_csv_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            # Read the CSV file
            csv_data = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8")))
            
            # Process the CSV data and make predictions
            predictions = predict_liver_csv(csv_data)
            
            return jsonify({'predictions': predictions})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type. Please upload a CSV.'}), 400

# New endpoint for CSV (kidney)
@app.route('/doctor/kidney', methods=['POST'])
def predict_kidney_csv_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            # Read the CSV file
            csv_data = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8")))
            
            # Process the CSV data and make predictions
            predictions = predict_kidney_csv(csv_data)
            
            return jsonify({'predictions': predictions})
        except Exception as e:
            # Print the full traceback to the console
            print("An error occurred:", file=sys.stderr)
            traceback.print_exc()
            # Return a more detailed error message
            return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500
    else:
        return jsonify({'error': 'Invalid file type. Please upload a CSV.'}), 400

# New endpoint for CSV (heart)
@app.route('/doctor/heart', methods=['POST'])
def predict_heart_csv_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            # Read the CSV file
            csv_data = pd.read_csv(io.StringIO(file.stream.read().decode("UTF8")))
            
            # Process the CSV data and make predictions
            predictions = predict_heart_csv(csv_data)
            
            if not predictions:
                raise ValueError("No predictions returned")
            
            return jsonify({'predictions': predictions})
        except Exception as e:
            print(f"Error in heart disease prediction endpoint: {str(e)}")
            print(traceback.format_exc())
            return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500
    else:
        return jsonify({'error': 'Invalid file type. Please upload a CSV.'}), 400

# New endpoint for PDF (kidney)
@app.route('/user/kidney', methods=['POST'])
def predict_kidney():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Save the file temporarily
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        
        try:
            # Process the PDF and get extracted data and missing features
            result = predict_kidney_func(temp_path)
            
            # Remove the temporary file
            os.remove(temp_path)
            
            return jsonify(result)
        except Exception as e:
            # Remove the temporary file in case of error
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"Error in kidney prediction: {str(e)}")  # Log the error
            return jsonify({'error': f"An error occurred during prediction: {str(e)}"}), 500
    else:
        return jsonify({'error': 'Invalid file type. Please upload a PDF.'}), 400

@app.route('/user/kidney/final', methods=['POST'])
def final_kidney_prediction():
    data = request.json
    if not data or 'features' not in data:
        return jsonify({'error': 'No feature data provided'}), 400
    
    try:
        result = make_final_prediction(data['features'])
        return jsonify({'prediction': result})
    except Exception as e:
        print(f"Error in final kidney prediction: {str(e)}")
        return jsonify({'error': f"An error occurred during final prediction: {str(e)}"}), 500

# New endpoint for manual heart disease prediction
@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        result = predict_heart_disease(data)
        return result
    except Exception as e:
        print(f"Error in heart disease prediction: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500


if __name__ == '__main__':
    app.run(debug=True)
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 10000))  # Render assigns a port
#     app.run(host="0.0.0.0", port=port)