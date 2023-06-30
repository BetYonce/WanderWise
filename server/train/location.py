from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib
import numpy as np

# Load data
df = pd.read_csv('travel.csv')

# Assuming `df` is your DataFrame with 'state', 'district', 'activity', and 'location' columns
X = df[['state', 'district', 'activity']]  # input features
y = df['location']  # target variable

# Convert categorical data to numerical data
X_encoded = pd.get_dummies(X)

# Split the data into training and testing sets
X_train, X_test_encoded, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Create and train the random forest
forest = RandomForestClassifier()  # use RandomForestClassifier here
forest.fit(X_train, y_train)

# Save the model to a joblib file
joblib.dump(forest, 'model.joblib')
joblib.dump(X_encoded.columns, 'features.joblib')

def recommend_locations(state, district, activity):
    # Create DataFrame from user input
    user_input_df = pd.DataFrame(data=[[state, district, activity]], 
                                columns=['state', 'district', 'activity'])

    # One-hot encode the user input to match the training data
    user_input_encoded = pd.get_dummies(user_input_df).reindex(columns = X_encoded.columns, fill_value=0)

    # Make predictions for the user input
    y_pred_proba = forest.predict_proba(user_input_encoded)

    # Get top 2 predictions
    top2_indices = np.argsort(y_pred_proba, axis=1)[:, -2:]  
    top2_predictions = [forest.classes_[indices] for indices in top2_indices]

    # Return the results
    return top2_predictions[0]
