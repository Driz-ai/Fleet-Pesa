from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from extensions import db
from models.user import User, UserRole
from schemas.user_schema import UserSchema
from utils.phone import normalize_kenyan_phone


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)

user_schema = UserSchema()


# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user account."""

    data = request.get_json(silent=True) or {}

    # Validate request data
    try:
        data = user_schema.load(data)
    except ValidationError as error:
        return jsonify({"error": error.messages}), 400

    username = data["username"]
    name = data["name"]
    password = data["password"]

    # Normalize phone
    try:
        phone = normalize_kenyan_phone(data["phone"])
    except ValueError:
        return jsonify({
            "error": "Invalid phone number."
        }), 400

    # Get requested role
    # If no role is supplied, create a driver account.
    role_value = data.get("role", UserRole.DRIVER.value)

    try:
        role = UserRole(str(role_value).lower())
    except ValueError:
        return jsonify({
            "error": "Invalid role. Use 'owner' or 'driver'."
        }), 400

    # Check username
    existing_username = User.query.filter_by(
        username=username
    ).first()

    if existing_username:
        return jsonify({
            "error": "That username already exists."
        }), 409

    # Check phone
    existing_phone = User.query.filter_by(
        phone=phone
    ).first()

    if existing_phone:
        return jsonify({
            "error": "An account with that phone number already exists."
        }), 409

    # Create user
    try:
        new_user = User(
            username=username,
            name=name,
            phone=phone,
            role=role,
            fleet_owner_id=None,
        )

        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Account created successfully.",
            "user": new_user.to_dict(),
        }), 201

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "error": "Username or phone number already exists."
        }), 409

    except ValueError as error:
        db.session.rollback()

        return jsonify({
            "error": str(error)
        }), 400

    except Exception as error:
        db.session.rollback()

        print("REGISTRATION ERROR:", error)

        return jsonify({
            "error": "Unable to create account."
        }), 500


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and return JWT tokens."""

    data = request.get_json(silent=True) or {}

    phone = data.get("phone")
    password = data.get("password")

    # Basic validation
    if not isinstance(phone, str) or not phone.strip():
        return jsonify({
            "error": "Phone number is required."
        }), 400

    if not isinstance(password, str) or not password:
        return jsonify({
            "error": "Password is required."
        }), 400

    # Normalize phone
    try:
        phone = normalize_kenyan_phone(phone)
    except ValueError:
        return jsonify({
            "error": "Invalid phone number or password."
        }), 401

    # Find user
    user = User.query.filter_by(phone=phone).first()

    # Verify password
    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid phone number or password."
        }), 401

    # Create access token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role.value,
        },
    )

    # Create refresh token
    refresh_token = create_refresh_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
    }), 200


# CURRENT USER
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Return the currently authenticated user."""

    user_id = get_jwt_identity()

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return jsonify({
            "error": "Invalid authentication token."
        }), 401

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "error": "User account not found."
        }), 404

    return jsonify({
        "user": user.to_dict(),
    }), 200


# REFRESH ACCESS TOKEN
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Generate a new access token from a refresh token."""

    user_id = get_jwt_identity()

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return jsonify({
            "error": "Invalid authentication token."
        }), 401

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({
            "error": "User account not found."
        }), 404

    # Create new access token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role.value,
        },
    )

    return jsonify({
        "access_token": access_token,
    }), 200

