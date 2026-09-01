from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError
from services.mpesa import MpesaService


mpesa = MpesaService()


class Mpesa(Resource):

    def post(self):
        data = request.get_json()

        phone_number = data["phone_number"]
        amount = data["amount"]
        account_reference = data["account_reference"]

        result = mpesa.stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=account_reference
        )

        return jsonify(result), 200

