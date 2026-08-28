from marshmallow import Schema, fields, validate


class FarePaymentCallbackSchema(Schema):
    mpesa_reference = fields.Str(required=True, validate=validate.Length(max=100))
    mpesa_transaction_code = fields.Str(required=True, validate=validate.Length(max=100))
    payment_status = fields.Str(
        required=False,
        load_default="confirmed",
        validate=validate.OneOf(("pending", "confirmed", "failed")),
    )


fare_payment_callback_schema = FarePaymentCallbackSchema()


class FarePaymentCreateSchema(Schema):
    vehicle_id = fields.Int(required=True, validate=validate.Range(min=1))
    customer_phone = fields.Str(required=True, validate=validate.Length(max=15))
    amount = fields.Decimal(
        required=True,
        places=2,
        as_string=False,
        validate=validate.Range(min=0),
    )


class FarePaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    vehicle_id = fields.Int(required=True)
    customer_phone = fields.Str(required=True)
    amount = fields.Decimal(as_string=True, required=True)
    mpesa_reference = fields.Str(allow_none=True)
    mpesa_transaction_code = fields.Str(allow_none=True)
    payment_status = fields.Str(required=True)
    requested_at = fields.DateTime(dump_only=True)


fare_payment_create_schema = FarePaymentCreateSchema()
fare_payment_schema = FarePaymentSchema()
