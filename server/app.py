from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from joblib import load

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

# Load the model
kmeans = load('model.joblib') 

# Load the original DataFrame
original_df = pd.read_pickle('original_df.pkl')

@app.route('/predict', methods=['POST'])  
def recommend():
    # Get data from POST request
    data = request.get_json(force=True)

    # Get recommendation
    recommendation = recommend_location(data['state'], data['district'], data['activity'])

    # Check if recommendation is a DataFrame
    if isinstance(recommendation, pd.Series):
        # If it's a Series, convert to dictionary and return as JSON
        return jsonify(recommendation.to_dict())
    else:
        # If it's not a Series (i.e., it's a string), just return the string
        return recommendation

# Recommendation function
def recommend_location(state, district, activity):
    # Filter the original DataFrame based on the user's input
    filtered_df = original_df[(original_df['state'] == state) & (original_df['district'] == district) & (original_df['activity'] == activity)]
    
    # If there are no locations that match the user's input, return a message
    if filtered_df.empty:
        return "No locations found that match your criteria."
    
    # Otherwise, return the location with the highest popularity
    else:
        recommended_location = filtered_df.loc[filtered_df['popularity'].idxmax()]
        # Select only the columns you want to return
        recommended_location = recommended_location[['state', 'district', 'activity', 'location', 'hours of operation', 'estimated visit duration', 'cost of visit', 'type of location', 'popularity']]
        return recommended_location

@app.route('/')
def home():
    return "Hello, World!"


if __name__ == "__main__":
   app.debug = True
   app.run()
   app.run(debug = True)
