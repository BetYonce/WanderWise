import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from joblib import dump, load

# Load data
df = pd.read_excel('newtravel.xlsx')

# Keep a copy of the original DataFrame
original_df = df.copy()

# Save the original DataFrame to a file
original_df.to_pickle('original_df.pkl')

# Preprocessing
le = LabelEncoder()
for column in df.columns:
    if df[column].dtype == type(object):
        df[column] = le.fit_transform(df[column])

# KMeans instance
kmeans = KMeans(n_clusters=3)

# Fit and predict 
df['cluster'] = kmeans.fit_predict(df)

# Now, each instance has been assigned to a cluster
print(df.head())

# Save the model to a file
dump(kmeans, 'model.joblib') 

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

