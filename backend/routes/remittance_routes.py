from datetime import datetime, time

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from extensions import db
from models.remittance import Remittance
from models.user import User
from models.vehicle import Vehicle
from utils.access_control import _can_access_vehicle


class VehicleRemittanceHistory(Resource):
    @jwt_required()
    def get(self, vehicle_id):
        vehicle = db.session.get(Vehicle, vehicle_id)
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404
        if not _can_access_vehicle(db.session.get(User, int(get_jwt_identity())), vehicle):
            return {"message": "You do not have access to this vehicle"}, 403

        query = Remittance.query.filter_by(vehicle_id=vehicle_id)
        status = request.args.get("status")
        if status and status != "all":
            if status not in ("paid", "short"):
                return {"message": "status must be paid, short or all"}, 400
            query = query.filter_by(status=status)

        try:
            if request.args.get("from"):
                query = query.filter(
                    Remittance.submitted_at >= datetime.fromisoformat(
                        request.args["from"]
                    ).replace(tzinfo=None)
                )
            if request.args.get("to"):
                end_date = datetime.fromisoformat(
                    request.args["to"]
                ).date()
                query = query.filter(
                    Remittance.submitted_at
                    <= datetime.combine(end_date, time.max)
                )
        except ValueError:
            return {
                "message": "from and to must use YYYY-MM-DD format"
            }, 400

        return {
            "vehicle": {
                "id": vehicle.id,
                "plate_number": vehicle.plate_number,
                "vehicle_type": vehicle.vehicle_type,
            },
            "remittances": [
                item.to_dict()
                for item in query.order_by(
                    Remittance.submitted_at.desc()
                ).all()
            ],
        }, 200


class RemittancePrompt(Resource):
    @jwt_required()
    def post(self, remittance_id):
        user_id = int(get_jwt_identity())
        remittance = db.session.get(Remittance, remittance_id)
        if remittance is None:
            return {"message": "Remittance not found"}, 404

        vehicle = db.session.get(Vehicle, remittance.vehicle_id)
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404

        user = db.session.get(User, user_id)
        if user is None:
            return {"message": "User not found"}, 404
        if user.role != "admin" or user.fleet_owner_id != vehicle.fleet_owner_id:
            return {
                "message": "Only the vehicle owner can send a payment prompt"
            }, 403

        outstanding = remittance.expected_amount - remittance.actual_amount
        if outstanding <= 0:
            return {
                "message": "This remittance has no outstanding amount"
            }, 400

        remittance.flagged_for_followup = True
        db.session.commit()
        return {
            "message": "Payment prompt sent successfully",
            "remittance": remittance.to_dict(),
            "outstanding_amount": float(outstanding),
        }, 200
