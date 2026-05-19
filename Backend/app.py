from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)


CORS(app)

print("Loading the model...")
with open('models/car_price_model.pkl', 'rb') as file:
    model_data = pickle.load(file)
    
model = model_data['model']
model_columns = model_data['columns']
model_stats = model_data['stats']
print("Model loaded successfully!")


@app.route('/predict', methods=['POST'])
def predict_price():
    try:

        data = request.get_json()
        
        df = pd.DataFrame([data])

        df = pd.get_dummies(df)
        
        df = df.reindex(columns=model_columns, fill_value=0)
        
    
        prediction = model.predict(df)[0]
        
        return jsonify({
            'predicted_price_tk': round(prediction, 2) ,
            'model_statistics': model_stats,        
            'user_inputs': data                     
        })

    except Exception as e:
        
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def home():
    return "AI Car Price Predictor Backend is Awake and Running Successfully!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)