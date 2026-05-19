from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

# 1. Initialize the Flask App
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
# This is CRITICAL! It allows your React app (running on a different port) to talk to this Python app safely.
CORS(app)

# 2. Load the Saved Model and Columns
print("Loading the model...")
with open('models/car_price_model.pkl', 'rb') as file:
    model_data = pickle.load(file)
    
model = model_data['model']
model_columns = model_data['columns']
model_stats = model_data['stats']
print("Model loaded successfully!")

# 3. Create the API Route /predict
# React will send data to this URL using a POST request
@app.route('/predict', methods=['POST'])
def predict_price():
    try:
        # A. Get the JSON data sent from the React website
        data = request.get_json()
        
        # B. Convert the data into a Pandas DataFrame (just one row)
        df = pd.DataFrame([data])
        
        # C. Convert text (brand, condition) into 1s and 0s (One-Hot Encoding) just like we did in training
        df = pd.get_dummies(df)
        
        # D. Align columns: Ensure this new data has the EXACT same columns as the training data
        # If the user sends a brand that wasn't in our training data, it fills it with 0 to prevent crashes
        df = df.reindex(columns=model_columns, fill_value=0)
        
        # E. Make the Prediction using our loaded AI Brain!
        prediction = model.predict(df)[0]
        
        # F. Send the predicted price back to React as a JSON response
        return jsonify({
            'predicted_price_tk': round(prediction, 2) ,
            'model_statistics': model_stats,         # <--- New!
            'user_inputs': data                      # <--- Point 5: Returning the user's input summary!
        })

    except Exception as e:
        # If anything goes wrong, send the error back
        return jsonify({'error': str(e)}), 400

# --- NEW: Health Check Route ---
@app.route('/', methods=['GET'])
def home():
    return "AI Car Price Predictor Backend is Awake and Running Successfully!"
# -------------------------------

# 4. Run the Server
if __name__ == '__main__':
    # Runs on http://127.0.0.1:5000/ by default
    app.run(debug=True, port=5000)