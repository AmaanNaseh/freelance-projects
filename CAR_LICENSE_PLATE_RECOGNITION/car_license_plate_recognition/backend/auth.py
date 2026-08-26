from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import users
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)

SECRET = os.getenv("JWT_SECRET", "secret")

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400
    hashed = generate_password_hash(data["password"])
    users.insert_one({"email": data["email"], "password": hashed, "name": data["name"]})
    return jsonify({"message": "User created"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    token = jwt.encode({"email": user["email"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)}, SECRET)
    return jsonify({"token": token, "name": user["name"]})
