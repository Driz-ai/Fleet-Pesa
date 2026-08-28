from datetime import datetime, time

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from extensions import db
from models.driver_assignment import DriverAssignment
from models.remittance import Remittance
from models.user import User
from models.vehicle import Vehicle
from schemas.remittance_schema import (
    remittance_create_schema,
    remittance_schema,
    remittance_update_schema,
    remittances_schema,
)


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


def _can_access_vehicle(user, vehicle):
    if user is None or vehicle is None:
        return False
    if user.role == "admin" and user.fleet_owner_id == vehicle.fleet_owner_id:
        return True
    return DriverAssignment.query.filter_by(
        vehicle_id=vehicle.id,
        driver_id=user.id,
        unassigned_at=None,
    ).first() is not None


class RemittanceList(Resource):
    @jwt_required()
    def get(self):
        user = _current_user()
        if user is None:
            return {"message": "User not found"}, 404

        query = Remittance.query.join(Vehicle)
        if user.role == "admin":
            query = query.filter(Vehicle.fleet_owner_id == user.fleet_owner_id)
        else:
            query = query.join(
                DriverAssignment,
                DriverAssignment.vehicle_id == Vehicle.id,
            ).filter(
                DriverAssignment.driver_id == user.id,
                DriverAssignment.unassigned_at.is_(None),
            )

        vehicle_id = request.args.get("vehicle_id", type=int)
        if vehicle_id is not None:
            query = query.filter(Remittance.vehicle_id == vehicle_id)
        status = request.args.get("status")
        if status and status != "all":
            query = query.filter(Remittance.status == status)
        return {
            "remittances": remittances_schema.dump(
                query.order_by(Remittance.submitted_at.desc()).all()
            )
        }, 200

    @jwt_required()
    def post(self):
        user = _current_user()
        if user is None:
            return {"message": "User not found"}, 404
        try:
            data = remittance_create_schema.load(
                request.get_json(silent=True) or {}
            )
        except ValidationError as error:
            return {"message": "Invalid remittance data", "errors": error.messages}, 400

        vehicle = db.session.get(Vehicle, data["vehicle_id"])
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this vehicle"}, 403

        remittance = Remittance(**data)
        db.session.add(remittance)
        db.session.commit()
        return {"remittance": remittance_schema.dump(remittance)}, 201


class RemittanceDetail(Resource):
    @jwt_required()
    def patch(self, remittance_id):
        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if user is None:
            return {"message": "User not found"}, 404
        if remittance is None:
            return {"message": "Remittance not found"}, 404
        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this remittance"}, 403

        try:
            data = remittance_update_schema.load(
                request.get_json(silent=True) or {}
            )
        except ValidationError as error:
            return {"message": "Invalid remittance data", "errors": error.messages}, 400
        if not data:
            return {"message": "At least one remittance field is required"}, 400

        for field, value in data.items():
            setattr(remittance, field, value)
        db.session.commit()
        return {"remittance": remittance_schema.dump(remittance)}, 200


class VehicleRemittanceHistory(Resource):
    @jwt_required()
    def get(self, vehicle_id):
        user = _current_user()
        vehicle = db.session.get(Vehicle, vehicle_id)
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this vehicle"}, 403

        query = Remittance.query.filter_by(vehicle_id=vehicle_id)
        status = request.args.get("status")
        if status and status != "all":
            if status not in ("paid", "short", "late"):
                return {"message": "status must be paid, short, late or all"}, 400
            query = query.filter_by(status=status)
        try:
            if request.args.get("from"):
                query = query.filter(
                    Remittance.submitted_at >= datetime.fromisoformat(
                        request.args["from"]
                    ).replace(tzinfo=None)
                )
            if request.args.get("to"):
                end_date = datetime.fromisoformat(request.args["to"]).date()
                query = query.filter(
                    Remittance.submitted_at <= datetime.combine(end_date, time.max)
                )
        except ValueError:
            return {"message": "from and to must use YYYY-MM-DD format"}, 400

        return {
            "vehicle": {
                "id": vehicle.id,
                "plate_number": vehicle.plate_number,
                "vehicle_type": vehicle.vehicle_type,
            },
            "remittances": remittances_schema.dump(
                query.order_by(Remittance.submitted_at.desc()).all()
            ),
        }, 200


class RemittancePrompt(Resource):
    @jwt_required()
    def post(self, remittance_id):
        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if user is None:
            return {"message": "User not found"}, 404
        if remittance is None:
            return {"message": "Remittance not found"}, 404
        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if user.role != "admin" or not _can_access_vehicle(user, vehicle):
            return {"message": "Only the vehicle owner can send a payment prompt"}, 403

        outstanding = remittance.expected_amount - remittance.actual_amount
        if outstanding <= 0:
            return {"message": "This remittance has no outstanding amount"}, 400
        remittance.flagged_for_followup = True
        db.session.commit()
        return {
            "message": "Payment prompt sent successfully",
            "remittance": remittance_schema.dump(remittance),
            "outstanding_amount": float(outstanding),
        }, 200
