import joblib
import numpy as np

# Load the saved model
model = joblib.load("diabetes_model.joblib")

# Sample input (you can change these values to test)
input_data = {
    "age": 55,
    "bmi": 32.5,
    "hypertension": 1,
    "cholesterol": 1,
    "exercise": 0,
    "sugar_intake": 2,
    "family_history": 1,
    "symptoms": 1,
    "smoker": 0
}

# Ensure input order matches training columns
input_array = np.array([[ 
    input_data["age"],
    input_data["bmi"],
    input_data["hypertension"],
    input_data["cholesterol"],
    input_data["exercise"],
    input_data["sugar_intake"],
    input_data["family_history"],
    input_data["symptoms"],
    input_data["smoker"]
]])

# Predict
prediction = model.predict(input_array)[0]

# Interpret prediction
result = "Diabetic Risk" if prediction == 1 else "No Diabetic Risk"

print(f"Prediction: {result}")
