from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from tensorflow import keras
from tensorflow.keras import layers
from flask_cors import CORS
import joblib  # To load pre-trained models

# --- Initialize Flask App ---
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Model Loading (Using pre-trained models) ---
# Instead of training models every time, load pre-trained models
rf_model = joblib.load('random_forest_model.pkl')  # Load pre-trained RandomForest model
nn_model = keras.models.load_model('neural_network_model.h5')  # Load pre-trained Neural Network model


# --- Define Routes ---
@app.route('/')
def home():
    return "Flask app is running!"


@app.route('/favicon.ico')
def favicon():
    return '', 204


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  # Get JSON input from frontend

        # Parse input data (handling missing fields and defaults)
        input_data = np.array([[
            data.get("pregnancies", 0),
            data.get("glucose", 0),
            data.get("blood_pressure", 0),
            data.get("skin_thickness", 0),
            data.get("insulin", 0),
            data.get("bmi", 0),
            data.get("age", 0),
            1 if data.get("gender", "").lower() == "male" else 0,
            1 if data.get("pcos", "").lower() == "yes" else 0,
            1 if data.get("exercise", "").lower() == "yes" else 0,
            {"caucasian": 0, "american": 1, "asian": 2, "hispanic": 3, "british": 4}.get(
                data.get("ethnicity", "").lower(), 4),
            data.get("diabetes_pedigree_function", 0.0),
        ]])

        # Predict using both models
        rf_prediction = rf_model.predict(input_data)[0]
        nn_prediction = nn_model.predict(input_data)[0][0]

        # Combine results (simple averaging of both predictions)
        final_prediction = round((rf_prediction + nn_prediction) / 2)

        # Return the final prediction result
        return jsonify({
            "prediction": "Diabetes" if final_prediction == 1 else "No Diabetes"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return error message if something goes wrong


# --- Start Flask Server ---
if __name__ == '__main__':
    app.run(debug=True)
