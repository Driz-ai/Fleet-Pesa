from datetime import datetime, timezone

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from extensions import db
from models.driver_assignment import DriverAssignment
from models.user import User, UserRole
from models.vehicle import Vehicle
from schemas.driver_assignment_schema import (
    driver_assignment_schema,
    driver_assignments_schema,
)


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


def _owns_vehicle(user, vehicle):
    return (
        user is not None
        and user.role == "admin"
        and user.fleet_owner_id == vehicle.fleet_owner_id
    )


class VehicleDriverAssignment(Resource):
    @jwt_required()
    def post(self, vehicle_id):
        user = _current_user()
        if user is None:
            return {"error": "User not found."}, 404

        vehicle = db.session.get(Vehicle, vehicle_id)
        if vehicle is None:
            return {"error": "Vehicle not found."}, 404
        if not _owns_vehicle(user, vehicle):
            return {"error": "Only the fleet owner can assign drivers."}, 403

        payload = request.get_json(silent=True) or {}
        try:
            data = driver_assignment_schema.load({
                "vehicle_id": vehicle_id,
                "driver_id": payload.get("driver_id"),
            })
        except ValidationError as error:
            return {"errors": error.messages}, 400

        driver = db.session.get(User, data["driver_id"])
        if driver is None:
            return {"error": "Driver not found."}, 404
        if driver.role != UserRole.DRIVER.value:
            return {"error": "Selected user is not a driver."}, 400

        current_assignment = DriverAssignment.query.filter_by(
            vehicle_id=vehicle_id,
            unassigned_at=None,
        ).first()
        driver_assignment = DriverAssignment.query.filter_by(
            driver_id=driver.id,
            unassigned_at=None,
        ).first()
        if driver_assignment is not None:
            return {"error": "Driver is already assigned to a vehicle."}, 409

        try:
            now = datetime.now(timezone.utc)
            if current_assignment is not None:
                current_assignment.unassigned_at = now

            assignment = DriverAssignment(
                vehicle_id=vehicle_id,
                driver_id=driver.id,
                assigned_at=now,
            )
            db.session.add(assignment)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"error": "Unable to assign driver."}, 500

        return driver_assignment_schema.dump(assignment), 201


class VehicleDriverHistory(Resource):
    @jwt_required()
    def get(self, vehicle_id):
        user = _current_user()
        if user is None:
            return {"error": "User not found."}, 404

        vehicle = db.session.get(Vehicle, vehicle_id)
        if vehicle is None:
            return {"error": "Vehicle not found."}, 404
        if not _owns_vehicle(user, vehicle):
            return {"error": "Only the fleet owner can view driver history."}, 403

        assignments = DriverAssignment.query.filter_by(
            vehicle_id=vehicle_id,
        ).order_by(DriverAssignment.assigned_at.asc()).all()
        return driver_assignments_schema.dump(assignments), 200


class DriverAssignments(Resource):
    @jwt_required()
    def get(self):
        user = _current_user()
        if user is None:
            return {"error": "User not found."}, 404
        if user.role != "admin":
            return {"error": "Only fleet owners can list assignments."}, 403

        assignments = (
            DriverAssignment.query
            .join(Vehicle)
            .filter(Vehicle.fleet_owner_id == user.fleet_owner_id)
            .all()
        )
        return driver_assignments_schema.dump(assignments), 200


class DriverAssignmentById(Resource):
    @jwt_required()
    def get(self, id):
        assignment = db.session.get(DriverAssignment, id)
        if assignment is None:
            return {"error": "Driver assignment not found."}, 404
        user = _current_user()
        if not _owns_vehicle(user, assignment.vehicle):
            return {"error": "You do not have access to this assignment."}, 403
        return driver_assignment_schema.dump(assignment), 200


class UnassignDriver(Resource):
    @jwt_required()
    def patch(self, id):
        assignment = db.session.get(DriverAssignment, id)
        if assignment is None:
            return {"error": "Driver assignment not found."}, 404
        user = _current_user()
        if not _owns_vehicle(user, assignment.vehicle):
            return {"error": "Only the fleet owner can unassign drivers."}, 403
        if assignment.unassigned_at is not None:
            return {"error": "Driver is already unassigned."}, 409

        assignment.unassigned_at = datetime.now(timezone.utc)
        db.session.commit()
        return driver_assignment_schema.dump(assignment), 200
