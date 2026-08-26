# Import necessary libraries
from flask import Flask, request, jsonify, session
import joblib
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
from datetime import datetime
import numpy as np
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

# MongoDB connection
client = MongoClient(os.getenv("MONGO_DB_URL"))
db = client["careconnect"]
users_collection = db["users"]
reports_collection = db["diabetes_reports"]
appointments_collection = db["appointments"]

app = Flask(__name__)

# Enable CORS for all routes (Allow credentials for session)
CORS(app, supports_credentials=True)

app.secret_key = "careconnect"

# Load the trained diabetes model
diabetes_model = joblib.load("diabetes_model.joblib")

# ---------------- AUTH ROUTES ----------------

# Helper function to hash passwords
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt)


# Helper function to check password
def check_password(hashed_password, password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password)


# Signup route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    user_type = data.get("user_type")  # "patient" or "doctor"
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the email already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already in use"}), 400

    # Hash the password before storing
    hashed_password = hash_password(password)

    # Store user details in MongoDB
    user_data = {"name": name, "email": email, "password": hashed_password, "user_type": user_type}

    if user_type == "doctor":
        specialist_category = data.get("specialist_category")
        if not specialist_category:
            return jsonify({"error": "Specialist category is required for doctors"}), 400
        user_data["specialist_category"] = specialist_category

    users_collection.insert_one(user_data)
    return jsonify({"message": "Signup successful"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = users_collection.find_one({"email": email, "user_type": user_type})
    
    if not user or not check_password(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 400

    session.permanent = True  # Ensure session is persistent
    session["user"] = {
        "email": user["email"],
        "name": user["name"],
        "user_type": user["user_type"]
    }

    return jsonify({"message": "Login successful", "user_type": user["user_type"]}), 200


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)  # Remove user session
    return jsonify({"message": "Logout successful"}), 200


@app.route("/profile", methods=["GET"])
def profile():
    if "user" not in session:  # Check session correctly
        return jsonify({"error": "Unauthorized"}), 401

    # Extract user email from session
    email = session["user"]["email"]
    
    # Fetch user details from the database
    user = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


@app.route("/available-doctors", methods=["GET"])
def available_doctors():
    try:
        # Fetch all doctors from the database
        doctors = list(
            users_collection.find(
                {"user_type": "doctor"},  # Filter by user_type = doctor
                {"_id": 0, "name": 1, "specialist_category": 1, "email": 1},  # Only return name and specialist category
            )
        )

        if not doctors:
            return jsonify({"message": "No doctors available"}), 404

        return jsonify({"doctors": doctors}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- DIABETES QUIZ ----------------

def get_suggestions(probability):
    if probability < 0.3:
        return {
            "level": "Low Risk",
            "suggestions": "Maintain a healthy lifestyle with regular exercise and balanced diet.",
            "precautions": "Keep sugar intake low and monitor blood pressure.",
            "medicine": "No medication required. Natural care is sufficient."
        }
    elif 0.3 <= probability < 0.7:
        return {
            "level": "Moderate Risk",
            "suggestions": "Consult a doctor for further tests. Improve diet and increase activity.",
            "precautions": "Avoid sugary drinks, processed food. Monitor BMI regularly.",
            "medicine": "Metformin (only after doctor's consultation)."
        }
    else:
        return {
            "level": "High Risk",
            "suggestions": "Visit a diabetologist immediately. Start treatment and diet control.",
            "precautions": "Daily sugar monitoring. Follow a strict diabetes-friendly diet.",
            "medicine": "Insulin or prescribed medication based on doctor advice."
        }


# DIABETES
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    user_email = session["user"]["email"]

    quiz_data = {
        "user_email": user_email,
        "quiz_title": data.get("quiz_title", "Untitled Quiz"),
        "questions": data.get("questions", []),  # List of dicts: {question, userAnswer, correctAnswer, isCorrect}
        "score": data.get("score", 0),
        "timestamp": datetime.now()
    }

    try:
        db["quizzes"].insert_one(quiz_data)
        return jsonify({"message": "Quiz submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get-quizzes", methods=["GET"])
def get_quizzes():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_email = session["user"]["email"]
        quizzes = db["quizzes"].find({"user_email": user_email})
        quiz_list = []

        for quiz in quizzes:
            quiz_list.append({
                "quiz_title": quiz.get("quiz_title", ""),
                "questions": quiz.get("questions", []),
                "score": quiz.get("score", 0),
                "timestamp": quiz.get("timestamp")
            })

        return jsonify({"quizzes": quiz_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict-diabetes", methods=["POST"])
def predict_diabetes():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        user = session["user"]

        required_fields = [
            "age", "bmi", "hypertension", "cholesterol", "exercise",
            "sugar_intake", "family_history", "symptoms", "smoker"
        ]

        input_values = np.array([[data[field] for field in required_fields]])
        prediction = diabetes_model.predict(input_values)[0]
        probability = float(diabetes_model.predict_proba(input_values)[0][1])

        recommendations = get_suggestions(probability)

        report = {
            "user_email": user["email"],
            "user_name": user["name"],
            "inputs": {field: data[field] for field in required_fields},
            "prediction": bool(prediction),
            "probability": round(probability, 3),
            "recommendations": recommendations,
            "timestamp": datetime.now()
        }

        inserted = reports_collection.insert_one(report)
        report["_id"] = str(inserted.inserted_id)

        return jsonify(report), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/diabetes-report/<report_id>", methods=["GET"])
def get_diabetes_report(report_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        report = reports_collection.find_one({"_id": ObjectId(report_id)})
        if not report:
            return jsonify({"error": "Report not found"}), 404

        report["_id"] = str(report["_id"])
        return jsonify(report), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/get-all-reports", methods=["GET"])
def get_all_reports():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        reports = list(reports_collection.find({}, {
        "_id": 1,
        "user_name": 1,
        "user_email": 1,
        "recommendations.level": 1,
        "timestamp": 1
    }))

        for r in reports:
            r["_id"] = str(r["_id"])
            r["timestamp"] = r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify({"reports": reports}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- APPOINTMENT BOOKING ----------------

@app.route("/book-appointment", methods=["POST"])
def book_appointment():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    doctor_email = data.get("doctor_email")
    date = data.get("date")
    time = data.get("time")

    if not doctor_email or not date or not time:
        return jsonify({"error": "Missing required fields"}), 400

    appointment = {
        "patient_email": session["user"]["email"],
        "doctor_email": doctor_email,
        "date": date,
        "time": time,
        "status": "pending",
        "created_at": datetime.now()
    }

    try:
        appointments_collection.insert_one(appointment)
        return jsonify({"message": "Appointment booked successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/user-appointments", methods=["GET"])
def get_user_appointments():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_email = session["user"]["email"]
    try:
        # Note: Change "user_email" to "patient_email" because in appointment doc it's saved as patient_email.
        user_appointments = list(appointments_collection.find({"patient_email": user_email}))
        for appt in user_appointments:
            appt["_id"] = str(appt["_id"])
            appt["created_at"] = appt["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify({"appointments": user_appointments}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/my-appointments", methods=["GET"])
def get_my_appointments():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    query = {"patient_email": user["email"]} if user["user_type"] == "patient" else {"doctor_email": user["email"]}

    try:
        appointments = list(appointments_collection.find(query, {"_id": 0}))
        return jsonify({"appointments": appointments}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/doctor-appointments", methods=["GET"])
def doctor_appointments():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    if user["user_type"] != "doctor":
        return jsonify({"error": "Only doctors can view appointments"}), 403

    try:
        doctor_email = user["email"]
        appointments = list(appointments_collection.find({"doctor_email": doctor_email}))

        results = []
        for appointment in appointments:
            patient = users_collection.find_one({"email": appointment["patient_email"]})
            results.append({
                "_id": str(appointment["_id"]),
                "patient_name": patient["name"] if patient else "Unknown",
                "appointment_date": f"{appointment['date']} at {appointment['time']}",
                "status": appointment["status"].capitalize()
            })

        return jsonify({"appointments": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update-appointment-status", methods=["POST"])
def update_appointment_status():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    if user["user_type"] != "doctor":
        return jsonify({"error": "Only doctors can update appointments"}), 403

    data = request.get_json()
    appointment_id = data.get("appointment_id")
    status = data.get("status")

    if not appointment_id or status not in ["Accepted", "Rejected"]:
        return jsonify({"error": "Invalid request data"}), 400

    try:
        result = appointments_collection.update_one(
            {"_id": ObjectId(appointment_id), "doctor_email": user["email"]},
            {"$set": {"status": status.lower()}}
        )

        if result.modified_count == 0:
            return jsonify({"error": "Appointment not found or already updated"}), 404

        return jsonify({"message": f"Appointment {status.lower()} successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
