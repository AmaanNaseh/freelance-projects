from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from auth import auth_bp
from ocr import extract_text
from database import records
import os
import datetime
import jwt
import cv2
from database import users  # Assuming you have users collection in `database.py`


app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_bp)

UPLOAD_FOLDER = 'uploads'
JWT_SECRET = os.getenv("JWT_SECRET", "secret")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def verify_token(token):
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return data["email"]
    except:
        return None

@app.route("/upload", methods=["POST"])
def upload():
    token = request.headers.get("Authorization").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    # Fetch user name from DB
    user = users.find_one({"email": user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    file = request.files['image']
    ext = os.path.splitext(file.filename)[1]  # Get the file extension
    unique_filename = f"{datetime.datetime.utcnow().timestamp()}{ext}"
    path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(path)

    number_plate = extract_text(path)

    record = {
        "filename": unique_filename,
        "number_plate": number_plate,
        "timestamp": datetime.datetime.utcnow(),
        "user_email": user_email
    }

    records.insert_one(record)
    return jsonify({"message": "Uploaded", "number_plate": number_plate})

@app.route("/records", methods=["GET"])
def get_records():
    token = request.headers.get("Authorization", "").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    search = request.args.get("search", "")
    query = {
        "user_email": user_email
    }
    if search:
        query["number_plate"] = {"$regex": search, "$options": "i"}

    result = list(records.find(query, {"_id": 0, "number_plate": 1, "timestamp": 1, "filename": 1}))
    for r in result:
        r["image_url"] = f"http://localhost:5000/uploads/{r['filename']}"
    return jsonify(result)

@app.route("/record/<filename>", methods=["DELETE"])
def delete_record(filename):
    token = request.headers.get("Authorization", "").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    result = records.delete_one({"user_email": user_email, "filename": filename})
    if result.deleted_count == 0:
        return jsonify({"error": "Record not found or not authorized"}), 404

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({"message": "Record deleted successfully"})


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return open(os.path.join(UPLOAD_FOLDER, filename), 'rb').read()

@app.route("/capture", methods=["POST"])
def capture_from_camera():
    token = request.headers.get("Authorization").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    user = users.find_one({"email": user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500

    filename = f"captured_{datetime.datetime.utcnow().timestamp()}.jpg"
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    cv2.imwrite(path, frame)
    cam.release()

    number_plate = extract_text(path)

    record = {
    "filename": filename,
    "number_plate": number_plate,
    "timestamp": datetime.datetime.utcnow(),
    "user_email": user_email  # ✅ Add this line
    }


    records.insert_one(record)
    return jsonify({"message": "Captured", "number_plate": number_plate})


@app.route("/profile", methods=["GET"])
def get_profile():
    token = request.headers.get("Authorization", "").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    user = users.find_one({"email": user_email}, {"_id": 0, "password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)

@app.route("/profile", methods=["PUT"])
def update_profile():
    token = request.headers.get("Authorization", "").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    data = request.json
    update_data = {}
    if "name" in data:
        update_data["name"] = data["name"]
    if "email" in data:
        update_data["email"] = data["email"]
    if "password" in data:
        update_data["password"] = data["password"]  # hash in production!

    if not update_data:
        return jsonify({"error": "No data to update"}), 400

    users.update_one({"email": user_email}, {"$set": update_data})

    # If email was changed, return new token
    new_email = update_data.get("email", user_email)
    token = jwt.encode({"email": new_email}, JWT_SECRET, algorithm="HS256")
    return jsonify({"message": "Profile updated", "token": token})

@app.route("/profile", methods=["DELETE"])
def delete_profile():
    token = request.headers.get("Authorization", "").split()[1]
    user_email = verify_token(token)
    if not user_email:
        return jsonify({"error": "Invalid token"}), 401

    # Delete uploaded files linked to user's records
    user_records = list(records.find({"user_email": user_email}))
    for rec in user_records:
        file_path = os.path.join(UPLOAD_FOLDER, rec["filename"])
        if os.path.exists(file_path):
            os.remove(file_path)

    # Delete user's records and user account
    records.delete_many({"user_email": user_email})
    users.delete_one({"email": user_email})

    return jsonify({"message": "Account and associated records deleted successfully"})



# if __name__ == "__main__":
#     app.run(host="0.0.0.0", debug=False, port=5000)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
