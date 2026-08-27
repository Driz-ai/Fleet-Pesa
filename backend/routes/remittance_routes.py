from datetime import datetime, time

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Api, Resource
from marshmallow import ValidationError

from extensions import db
from models.remittance import Remittance
from models.vehicle import Vehicle
from models.user import User
from models.driver_assignment import DriverAssignment
from schemas.remittance_schema import (
    remittance_create_schema,
    remittance_update_schema,
    remittance_filter_schema,
    remittance_schema,
    remittances_schema,
)

remittance_bp = Blueprint("remittances", __name__, url_prefix="/api")
api = Api(remittance_bp)


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


def _can_access_vehicle(user, vehicle):
    """NOTE: checks vehicle.owner_id/driver_assignments as they currently
    exist on dev. Revisit once Bright's Vehicle rewrite (fleet_owner_id)
    lands — this should then check fleet_owner_id instead of owner_id."""
    if user is None or vehicle is None:
        return False
    role = getattr(user, "role", None)
    if role in ("admin", "owner"):
        return vehicle.owner_id == user.id
    if role == "driver":
        assignment = DriverAssignment.query.filter_by(
            vehicle_id=vehicle.id, driver_id=user.id, unassigned_at=None
        ).first()
        return assignment is not None
    return False


def _compute_status(expected_amount, actual_amount):
    return "paid" if actual_amount >= expected_amount else "short"


class RemittanceListResource(Resource):
    method_decorators = [jwt_required()]

    def get(self):
        """GET /api/remittances — list with optional filters."""
        try:
            filters = remittance_filter_schema.load(request.args)
        except ValidationError as error:
            return {"message": "Invalid filters", "errors": error.messages}, 400

        user = _current_user()
        if user is None:
            return {"message": "User not found"}, 404

        query = Remittance.query.join(Vehicle, Remittance.vehicle_id == Vehicle.id)

        role = getattr(user, "role", None)
        if role in ("admin", "owner"):
            query = query.filter(Vehicle.owner_id == user.id)
        elif role == "driver":
            assigned_vehicle_ids = [
                row.vehicle_id
                for row in DriverAssignment.query.filter_by(driver_id=user.id, unassigned_at=None).all()
            ]
            query = query.filter(Remittance.vehicle_id.in_(assigned_vehicle_ids))
        else:
            return {"message": "Unrecognized role"}, 403

        status = filters.get("status")
        if status and status != "all":
            query = query.filter(Remittance.status == status)

        if filters.get("vehicle_id"):
            query = query.filter(Remittance.vehicle_id == filters["vehicle_id"])

        if filters.get("date_from"):
            query = query.filter(Remittance.submitted_at >= datetime.combine(filters["date_from"], time.min))
        if filters.get("date_to"):
            query = query.filter(Remittance.submitted_at <= datetime.combine(filters["date_to"], time.max))

        results = query.order_by(Remittance.submitted_at.desc()).all()

        if filters.get("driver_id"):
            results = [r for r in results if r.driver_id == filters["driver_id"]]

        return {"remittances": remittances_schema.dump(results)}, 200

    def post(self):
        """POST /api/remittances — create. expected_amount and status are
        never taken from the client."""
        try:
            data = remittance_create_schema.load(request.get_json(silent=True) or {})
        except ValidationError as error:
            return {"message": "Invalid remittance data", "errors": error.messages}, 400

        user = _current_user()
        if user is None:
            return {"message": "User not found"}, 404

        vehicle = db.session.get(Vehicle, data["vehicle_id"])
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404

        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this vehicle"}, 403

        expected_amount = vehicle.daily_expected_amount
        actual_amount = data["actual_amount"]
        status = _compute_status(expected_amount, actual_amount)

        remittance = Remittance(
            vehicle_id=vehicle.id,
            expected_amount=expected_amount,
            actual_amount=actual_amount,
            status=status,
            payment_status=data.get("payment_status", "pending"),
            mpesa_reference=data.get("mpesa_reference"),
            mpesa_transaction_code=data.get("mpesa_transaction_code"),
            flagged_for_followup=data.get("flagged_for_followup", False),
        )
        db.session.add(remittance)
        db.session.commit()

        return {"remittance": remittance_schema.dump(remittance)}, 201


class RemittanceResource(Resource):
    method_decorators = [jwt_required()]

    def get(self, remittance_id):
        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this remittance"}, 403

        return {"remittance": remittance_schema.dump(remittance)}, 200

    def patch(self, remittance_id):
        try:
            data = remittance_update_schema.load(request.get_json(silent=True) or {}, partial=True)
        except ValidationError as error:
            return {"message": "Invalid remittance data", "errors": error.messages}, 400

        if not data:
            return {"message": "At least one field is required"}, 400

        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this remittance"}, 403

        for field, value in data.items():
            setattr(remittance, field, value)

        if "actual_amount" in data:
            remittance.status = _compute_status(remittance.expected_amount, remittance.actual_amount)

        db.session.commit()
        return {"remittance": remittance_schema.dump(remittance)}, 200

    def put(self, remittance_id):
        try:
            data = remittance_update_schema.load(request.get_json(silent=True) or {})
        except ValidationError as error:
            return {"message": "Invalid remittance data", "errors": error.messages}, 400

        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this remittance"}, 403

        remittance.actual_amount = data["actual_amount"]
        remittance.payment_status = data.get("payment_status", "pending")
        remittance.mpesa_reference = data.get("mpesa_reference")
        remittance.mpesa_transaction_code = data.get("mpesa_transaction_code")
        remittance.flagged_for_followup = data.get("flagged_for_followup", False)
        remittance.status = _compute_status(remittance.expected_amount, remittance.actual_amount)

        db.session.commit()
        return {"remittance": remittance_schema.dump(remittance)}, 200

    def delete(self, remittance_id):
        user = _current_user()
        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this remittance"}, 403

        db.session.delete(remittance)
        db.session.commit()
        return {"message": "Remittance deleted"}, 200


class VehicleRemittanceHistoryResource(Resource):
    method_decorators = [jwt_required()]

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
            if status not in ("paid", "short"):
                return {"message": "status must be paid, short or all"}, 400
            query = query.filter_by(status=status)

        try:
            if request.args.get("from"):
                query = query.filter(Remittance.submitted_at >= datetime.fromisoformat(request.args["from"]).replace(tzinfo=None))
            if request.args.get("to"):
                end_date = datetime.fromisoformat(request.args["to"]).date()
                query = query.filter(Remittance.submitted_at <= datetime.combine(end_date, time.max))
        except ValueError:
            return {"message": "from and to must use YYYY-MM-DD format"}, 400

        return {
            "vehicle": {"id": vehicle.id, "plate_number": vehicle.plate_number, "vehicle_type": vehicle.vehicle_type},
            "remittances": [item.to_dict() for item in query.order_by(Remittance.submitted_at.desc()).all()],
        }, 200


class RemittancePromptResource(Resource):
    """Ported from dev: POST /api/remittances/<id>/prompt — sends a
    payment-prompt for the outstanding shortfall on a remittance."""
    method_decorators = [jwt_required()]

    def post(self, remittance_id):
        user_id = int(get_jwt_identity())

        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404

        if vehicle.owner_id != user_id:
            return {"message": "Only the vehicle owner can send a payment prompt"}, 403

        outstanding = remittance.expected_amount - remittance.actual_amount
        if outstanding <= 0:
            return {"message": "This remittance has no outstanding amount"}, 400

        remittance.flagged_for_followup = True
        db.session.commit()

        return {
            "message": "Payment prompt sent successfully",
            "remittance": remittance.to_dict(),
            "outstanding_amount": float(outstanding),
        }, 200


api.add_resource(RemittanceListResource, "/remittances")
api.add_resource(RemittanceResource, "/remittances/<int:remittance_id>")
api.add_resource(VehicleRemittanceHistoryResource, "/vehicles/<int:vehicle_id>/remittances")
api.add_resource(RemittancePromptResource, "/remittances/<int:remittance_id>/prompt")
