# app.py (Flask backend)

from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for frontend communication

# Load association rules model once during startup
try:
    rules = joblib.load("model/dish_recommender.joblib")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    # Validate input
    input_dish = data.get("dish", "").strip()
    if not input_dish:
        return jsonify({"error": "Dish name is required"}), 400

    recommendations = set()

    # Search for association rules matching the input dish
    for _, row in rules.iterrows():
        if input_dish in row['antecedents']:
            recommendations.update(row['consequents'])

    return jsonify({
        "dish": input_dish,
        "recommendations": sorted(recommendations)  # Optional: sorted list
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)
