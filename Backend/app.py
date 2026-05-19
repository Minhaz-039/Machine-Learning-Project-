from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

print("Loading the multi-model system...")
with open('models/multi_model.pkl', 'rb') as file:
    system_data = pickle.load(file)
    
model_columns = system_data['columns']
models = system_data['models']
model_stats = system_data['stats']
print("System loaded successfully!")

@app.route('/', methods=['GET'])
def home():
    return "AI Car Price Predictor (Multi-Model) is Awake!"

@app.route('/predict', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()
        
        # Get the selected model (default to Random Forest if missing)
        selected_model_name = data.get('selected_model', 'Random Forest')
        
        df = pd.DataFrame([data])
        df = pd.get_dummies(df)
        df = df.reindex(columns=model_columns, fill_value=0)
        
        # 1. Calculate prediction for the SELECTED model
        selected_model = models[selected_model_name]
        main_prediction = selected_model.predict(df)[0]
        
        # 2. Calculate predictions for ALL models for the comparison graph
        comparison_predictions = {}
        for name, mdl in models.items():
            comparison_predictions[name] = round(mdl.predict(df)[0], 2)
            
        # 3. Find the best model based on highest R2 score
        best_model = max(model_stats, key=lambda k: model_stats[k]['r2_score'])
            
        return jsonify({
            'predicted_price_tk': round(main_prediction, 2),
            'selected_model': selected_model_name,
            'best_model_suggestion': best_model,
            'all_predictions': comparison_predictions,
            'model_statistics': model_stats,
            'user_inputs': data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)