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
