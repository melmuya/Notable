# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User
from extensions import db
from sqlalchemy import or_


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'Email/Username and password required'}), 400

    user = User.query.filter(or_(User.username == identifier, User.email == identifier)).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token}), 200

    # if user and user.check_password(password):
    #     token = create_access_token(identity=str(user.id))
    #     return jsonify({'access_token': token}), 200
    # else:
    #     return jsonify({'error': 'Invalid credentials'}), 401
    



