from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from extensions import db
from models.driver_assignment import DriverAssignment
from models.user import User
from models.vehicle import Vehicle
from schemas.vehicle_schema import (
	vehicle_create_schema,
	vehicle_schema,
	vehicle_update_schema,
	vehicles_schema,
)


def _current_user():
	return db.session.get(User, int(get_jwt_identity()))


def _can_access_vehicle(vehicle, user_id):
	user = db.session.get(User, user_id)
	if user is None:
		return False
	if vehicle.fleet_owner_id == user.fleet_owner_id and user.role == "admin":
		return True
	return DriverAssignment.query.filter_by(
		vehicle_id=vehicle.id,
		driver_id=user_id,
		unassigned_at=None,
	).first() is not None


class VehicleList(Resource):
	@jwt_required()
	def get(self):
		user = _current_user()
		if user is None:
			return {"message": "User not found"}, 404
		if user.role != "admin":
			return {"message": "Only owners can list fleet vehicles"}, 403

		vehicles = Vehicle.query.filter_by(
			fleet_owner_id=user.fleet_owner_id
		).order_by(Vehicle.id).all()
		return {"vehicles": vehicles_schema.dump(vehicles)}, 200

	@jwt_required()
	def post(self):
		user = _current_user()
		if user is None:
			return {"message": "User not found"}, 404
		if user.role != "admin":
			return {"message": "Only owners can add vehicles"}, 403

		try:
			data = vehicle_create_schema.load(
				request.get_json(silent=True) or {}
			)
		except ValidationError as error:
			return {
				"message": "Invalid vehicle data",
				"errors": error.messages,
			}, 400

		if Vehicle.query.filter_by(
			plate_number=data["plate_number"]
		).first():
			return {"message": "plate_number is already registered"}, 409

		vehicle = Vehicle(
			plate_number=data["plate_number"],
			vehicle_type=data["vehicle_type"],
			fleet_owner_id=user.fleet_owner_id,
			daily_expected_amount=data["daily_expected_amount"],
			is_active=data.get("is_active", True),
		)
		db.session.add(vehicle)
		db.session.commit()
		return {"vehicle": vehicle_schema.dump(vehicle)}, 201


class VehicleDetail(Resource):
	@jwt_required()
	def get(self, vehicle_id):
		vehicle = db.session.get(Vehicle, vehicle_id)
		if vehicle is None:
			return {"message": "Vehicle not found"}, 404
		if not _can_access_vehicle(vehicle, int(get_jwt_identity())):
			return {"message": "You do not have access to this vehicle"}, 403
		return {"vehicle": vehicle_schema.dump(vehicle)}, 200

	@jwt_required()
	def patch(self, vehicle_id):
		user = _current_user()
		if user is None:
			return {"message": "User not found"}, 404
		vehicle = db.session.get(Vehicle, vehicle_id)
		if vehicle is None:
			return {"message": "Vehicle not found"}, 404
		if vehicle.fleet_owner_id != user.fleet_owner_id or user.role != "admin":
			return {
				"message": "Only the owning fleet owner can update this vehicle"
			}, 403

		try:
			data = vehicle_update_schema.load(
				request.get_json(silent=True) or {}
			)
		except ValidationError as error:
			return {
				"message": "Invalid vehicle data",
				"errors": error.messages,
			}, 400
		if not data:
			return {"message": "At least one vehicle field is required"}, 400

		if "plate_number" in data:
			existing = Vehicle.query.filter(
				Vehicle.plate_number == data["plate_number"],
				Vehicle.id != vehicle_id,
			).first()
			if existing:
				return {"message": "plate_number is already registered"}, 409

		for field, value in data.items():
			setattr(vehicle, field, value)
		db.session.commit()
		return {"vehicle": vehicle_schema.dump(vehicle)}, 200

	@jwt_required()
	def delete(self, vehicle_id):
		user = _current_user()
		if user is None:
			return {"message": "User not found"}, 404
		vehicle = db.session.get(Vehicle, vehicle_id)
		if vehicle is None:
			return {"message": "Vehicle not found"}, 404
		if vehicle.fleet_owner_id != user.fleet_owner_id or user.role != "admin":
			return {
				"message": "Only the owning fleet owner can remove this vehicle"
			}, 403

		db.session.delete(vehicle)
		db.session.commit()
		return "", 204