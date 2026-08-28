from marshmallow import Schema, fields, validate


<<<<<<< HEAD
class FarePaymentCallbackSchema(Schema):
    mpesa_reference = fields.Str(required=True, validate=validate.Length(max=100))
    mpesa_transaction_code = fields.Str(required=True, validate=validate.Length(max=100))
    payment_status = fields.Str(
        required=False,
        load_default="confirmed",
        validate=validate.OneOf(("pending", "confirmed", "failed")),
    )


fare_payment_callback_schema = FarePaymentCallbackSchema()


=======
>>>>>>> 96670e7b8a56aed76fc5ca1becc53292eefc051d
class FarePaymentCreateSchema(Schema):
    vehicle_id = fields.Int(required=True, validate=validate.Range(min=1))
    customer_phone = fields.Str(required=True, validate=validate.Length(max=15))
    amount = fields.Decimal(
        required=True,
        places=2,
        as_string=False,
        validate=validate.Range(min=0),
    )
<<<<<<< HEAD
=======
    mpesa_reference = fields.Str(
        required=False,
        allow_none=True,
        validate=validate.Length(max=100),
    )


class FarePaymentUpdateSchema(Schema):
    mpesa_transaction_code = fields.Str(
        required=False,
        allow_none=True,
        validate=validate.Length(max=100),
    )
    payment_status = fields.Str(
        required=False,
        validate=validate.OneOf(("pending", "confirmed", "failed")),
    )


class FarePaymentCallbackSchema(Schema):
    mpesa_reference = fields.Str(required=True, validate=validate.Length(max=100))
    mpesa_transaction_code = fields.Str(
        required=True,
        validate=validate.Length(max=100),
    )
    payment_status = fields.Str(
        required=False,
        load_default="confirmed",
        validate=validate.OneOf(("pending", "confirmed", "failed")),
    )
>>>>>>> 96670e7b8a56aed76fc5ca1becc53292eefc051d


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
<<<<<<< HEAD
fare_payment_schema = FarePaymentSchema()
=======
fare_payment_update_schema = FarePaymentUpdateSchema()
fare_payment_callback_schema = FarePaymentCallbackSchema()
fare_payment_schema = FarePaymentSchema()
fare_payments_schema = FarePaymentSchema(many=True)
>>>>>>> 96670e7b8a56aed76fc5ca1becc53292eefc051d
