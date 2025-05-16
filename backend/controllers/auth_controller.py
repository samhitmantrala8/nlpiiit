from flask import Blueprint, request, Response, session
from flask_bcrypt import Bcrypt
import json
from utils.db import users_collection

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username, email, password = data.get('username'), data.get('email'), data.get('password')

    if users_collection.find_one({"email": email}):
        return Response(json.dumps({"error": "User already exists"}), status=400, mimetype='application/json')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({"username": username, "email": email, "password": hashed_password})
    return Response(json.dumps({"message": "User registered successfully"}), status=201)

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email, password = data.get('email'), data.get('password')
    user = users_collection.find_one({"email": email})

    if not user or not bcrypt.check_password_hash(user['password'], password):
        return Response(json.dumps({"error": "Invalid email or password"}), status=401)

    session['email'] = email
    return Response(json.dumps({"message": "Signed in", "user": {"username": user['username'], "email": email}}), status=200)

@auth_bp.route('/signout', methods=['POST'])
def signout():
    session.pop('email', None)
    return Response("Signed out", status=200)
