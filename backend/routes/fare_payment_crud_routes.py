from uuid import uuid4

from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from extensions import db
from models.driver_assignment import DriverAssignment
from models.fare_payment import FarePayment
from models.user import User
from models.vehicle import Vehicle
from schemas.fare_payment_schema import (
    fare_payment_create_schema,
    fare_payment_schema,
)
from utils.access_control import _can_access_vehicle, _can_read_transaction


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


class FarePaymentCreate(Resource):
    @jwt_required()
    def post(self):
        user = _current_user()
        if user is None:
            return {"message": "User not found"}, 404
        try:
            data = fare_payment_create_schema.load(
                request.get_json(silent=True) or {}
            )
        except ValidationError as error:
            return {"message": "Invalid fare payment data", "errors": error.messages}, 400

        vehicle = db.session.get(Vehicle, data["vehicle_id"])
        if vehicle is None:
            return {"message": "Vehicle not found"}, 404
        if not _can_access_vehicle(user, vehicle):
            return {"message": "You do not have access to this vehicle"}, 403

        payment = FarePayment(
            **data,
            mpesa_reference=f"FP-{uuid4().hex[:24].upper()}",
        )
        db.session.add(payment)
        db.session.commit()
        return {"fare_payment": fare_payment_schema.dump(payment)}, 201


class FarePaymentDetail(Resource):
    @jwt_required()
    def get(self, payment_id):
        user = _current_user()
        payment = db.session.get(FarePayment, payment_id)
        if payment is None:
            return {"message": "Fare payment not found"}, 404
        vehicle = db.session.get(Vehicle, payment.vehicle_id)
        if not _can_read_transaction(user, vehicle, payment.requested_at):
            return {"message": "You do not have access to this fare payment"}, 403
        return {"fare_payment": fare_payment_schema.dump(payment)}, 200