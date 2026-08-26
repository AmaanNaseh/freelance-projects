from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import joblib
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import spacy
import nltk
from nltk.tokenize import sent_tokenize
from bson import ObjectId  # <-- Add this line
import requests
from bs4 import BeautifulSoup
import spacy.cli

# Load environment variables
load_dotenv()

# -------------------------- Flask Setup --------------------------

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
bcrypt = Bcrypt(app)  # Password hashing
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")  # Set JWT secret key
jwt = JWTManager(app)  # Initialize JWT

# -------------------------- Database Handling --------------------------

# Get MongoDB URI from .env
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["CyberRiskDB"]
users_collection = db["Users"]  # Store user details
risks_collection = db["RiskAssessments"]  # Store risk assessments
print("Connected to MongoDB")

def save_to_db(collection, data):
    collection.insert_one(data)
    print(f"✅ Data saved to {collection.name}")

## -------------------------- NLTK Handling --------------------------

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

nltk.download('punkt')
nlp = spacy.load("en_core_web_sm")

def analyze_threat(text):
    sentences = sent_tokenize(text)
    threat_entities = []

    for sentence in sentences:
        doc = nlp(sentence)
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT"]:
                threat_entities.append(ent.text)

    print("Processing text with NLP")

    return list(set(threat_entities))


# -------------------------- User Authentication --------------------------

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    existing_user = users_collection.find_one({"email": data['email']})
    
    if existing_user:
        return jsonify({"error": "User already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user = {
        "full_name": data['full_name'],
        "email": data['email'],
        "password": hashed_password
    }
    
    save_to_db(users_collection, user)
    return jsonify({"message": "User registered successfully!"}), 201

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data['email']})

    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({"error": "Invalid email or password!"}), 401

    access_token = create_access_token(identity=user['email'])
    return jsonify({"message": "Login successful!", "token": access_token, "full_name": user["full_name"]}), 200

# -------------------------- Prediction  --------------------------

# Load ML Model
model = joblib.load("cyber_risk_model.joblib")

# Predict Cyber Risk (Authenticated)
@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    user_email = get_jwt_identity()
    data = request.json
    features = np.array([[data['threat_level'], data['vulnerability_score'], data['impact_factor']]])
    prediction = model.predict(features)[0]

    risk_data = {
        "user_email": user_email,
        "threat_level": data['threat_level'],
        "vulnerability_score": data['vulnerability_score'],
        "impact_factor": data['impact_factor'],
        "risk_category": prediction,
        "timestamp": datetime.utcnow()
    }

    # Save the report to the database once
    save_to_db(risks_collection, risk_data)

    return jsonify({"risk_category": prediction, "message": "Risk assessment saved!"})

# Fetch all reports for a user
@app.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    user_email = get_jwt_identity()
    reports = risks_collection.find({"user_email": user_email})
    reports_list = []
    for report in reports:
        reports_list.append({
            "title": f"Risk Report - {report['timestamp']}",
            "generated_at": report['timestamp'],
            "risk_category": report['risk_category'],
            "_id": str(report['_id'])
        })
    return jsonify({"reports": reports_list})

# Fetch a single report by its ID
@app.route('/reports/<report_id>', methods=['GET'])
@jwt_required()
def get_report_by_id(report_id):
    user_email = get_jwt_identity()
    report = risks_collection.find_one({"_id": ObjectId(report_id), "user_email": user_email})
    
    if not report:
        return jsonify({"error": "Report not found or you don't have access to it!"}), 404
    
    # Return the report details
    return jsonify({
        "report": {
            "_id": str(report["_id"]),
            "risk_category": report["risk_category"],
            "threat_level": report["threat_level"],
            "vulnerability_score": report["vulnerability_score"],
            "impact_factor": report["impact_factor"],
            "generated_at": report["timestamp"],
            "threat_entities": report.get("threat_entities", [])
        }
    })

# Fetch user profile details
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_email = get_jwt_identity()
    user = users_collection.find_one({"email": user_email}, {"_id": 0, "full_name": 1, "email": 1})
    
    if not user:
        return jsonify({"error": "User not found!"}), 404
    
    return jsonify({"full_name": user["full_name"], "email": user["email"]}), 200


# List of risky keywords to scan for
RISKY_KEYWORDS = [
    "malware", "phishing", "trojan", "keylogger",
    "virus", "spyware", "download.exe", "hack", "unauthorized", "ransomware"
]

def simple_website_scanner(url):
    try:
        # Normalize URL
        if not url.startswith("http"):
            url = "http://" + url

        # Fetch website content
        response = requests.get(url, timeout=5)
        content = response.text

        # Analyze SSL/TLS
        ssl_present = url.startswith("https")

        # Analyze risky keywords
        soup = BeautifulSoup(content, "html.parser")
        text = soup.get_text().lower()
        risky_hits = sum(keyword in text for keyword in RISKY_KEYWORDS)

        # Analyze page length
        content_length = len(text)

        # ---------------- Scoring ----------------
        # Threat Level: based on risky keywords
        threat_level = min(10, risky_hits * 2)

        # Vulnerability Score: based on SSL and risky hits
        vulnerability_score = 5 if not ssl_present else 2
        vulnerability_score += min(5, risky_hits)

        # Impact Factor: based on very short/very long page and risky content
        if content_length < 500 or content_length > 100000:
            impact_factor = 7
        else:
            impact_factor = 3
        impact_factor += min(3, risky_hits)

        # Ensure all are capped at 10
        threat_level = min(threat_level, 10)
        vulnerability_score = min(vulnerability_score, 10)
        impact_factor = min(impact_factor, 10)

        return {
            "threatLevel": threat_level,
            "vulnerabilityScore": vulnerability_score,
            "impactFactor": impact_factor
        }

    except Exception as e:
        print(f"Error scanning {url}: {e}")
        return {"error": str(e)}

# -------- API Route --------
@app.route("/api/check-threat", methods=["POST"])
def check_threat():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    scan_result = simple_website_scanner(url)

    if "error" in scan_result:
        return jsonify({"error": scan_result["error"]}), 500

    return jsonify(scan_result)


# -------------------------- Running Application --------------------------
# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # Get port from environment, default to 5000
    app.run(host="0.0.0.0", port=port, debug=False)