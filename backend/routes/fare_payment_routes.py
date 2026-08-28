import hmac

from flask import current_app, request
from flask_restful import Resource
from marshmallow import ValidationError

from extensions import db
from models.fare_payment import FarePayment
from models.user import User
from models.vehicle import Vehicle
from schemas.fare_payment_schema import fare_payment_callback_schema
from utils.access_control import _can_access_vehicle


class FarePaymentCallback(Resource):
    def post(self):
        configured_secret = current_app.config.get("MPESA_CALLBACK_SECRET")
        received_secret = request.headers.get("X-MPESA-CALLBACK-SECRET", "")
        if not configured_secret:
            return {"message": "M-Pesa callback authentication is not configured"}, 503
        if not hmac.compare_digest(received_secret, configured_secret):
            return {"message": "Invalid M-Pesa callback signature"}, 401

        try:
            data = fare_payment_callback_schema.load(
                request.get_json(silent=True) or {}
            )
        except ValidationError as error:
            return {"message": "Invalid M-Pesa callback", "errors": error.messages}, 400

        payment = FarePayment.query.filter_by(
            mpesa_reference=data["mpesa_reference"]
        ).first()
        if payment is None:
            return {"message": "Fare payment not found"}, 404

        payment.mpesa_transaction_code = data["mpesa_transaction_code"]
        payment.payment_status = data["payment_status"]
        db.session.commit()
        return {"fare_payment": payment.to_dict()}, 200
