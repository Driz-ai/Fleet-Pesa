from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from extensions import db
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
	data = request.get_json(silent=True) or {}
	required = ("username", "name", "phone", "password", "role")
	if any(not data.get(field) for field in required):
		return jsonify(message="username, name, phone, password and role are required"), 400
	if data["role"] not in ("owner", "driver"):
		return jsonify(message="role must be owner or driver"), 400
	if User.query.filter((User.username == data["username"]) | (User.phone == data["phone"])).first():
		return jsonify(message="username or phone is already registered"), 409
	user = User(username=data["username"], name=data["name"], phone=data["phone"], role=data["role"])
	user.set_password(data["password"])
	db.session.add(user)
	db.session.commit()
	return jsonify(token=create_access_token(identity=str(user.id)), user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
	data = request.get_json(silent=True) or {}
	user = User.query.filter_by(phone=data.get("phone"), role=data.get("role")).first()
	if not user or not user.check_password(data.get("password", "")):
		return jsonify(message="Invalid phone, role or password"), 401
	return jsonify(token=create_access_token(identity=str(user.id)), user=user.to_dict())
