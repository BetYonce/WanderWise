from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import joblib
import numpy as np


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# load the model
model = joblib.load('model.joblib')

# features from the model
features = joblib.load('features.joblib')

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    # Get data from POST request
    data = request.get_json(force=True)

    # Convert data into dataframe
    input_data = pd.DataFrame.from_dict({
        'state': [data['state']],
        'district': [data['district']],
        'activity': [data['activity']]
    })

    # One hot encode the data
    input_data_encoded = pd.get_dummies(input_data)

    # Add missing columns and set them to 0
    missing_cols = set(features) - set(input_data_encoded.columns)
    for c in missing_cols:
        input_data_encoded[c] = 0

    # Ensure the order of columns in the dataframe
    input_data_encoded = input_data_encoded[features]

    # Make prediction
    prediction_proba = model.predict_proba(input_data_encoded)

    # Get top 2 predictions
    top2_indices = np.argsort(prediction_proba, axis=1)[:, -2:]  
    top2_predictions = [model.classes_[indices] for indices in top2_indices]

    return jsonify({
        'state': data['state'],
        'district': data['district'],
        'activity': data['activity'],
        'location_1': top2_predictions[0][0],
        'location_2': top2_predictions[0][1]
    })


if __name__ == "__main__":
   app.debug = True
   app.run()
   app.run(debug = True)
