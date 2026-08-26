from marshmallow import Schema, fields


class FleetOwnerSchema(Schema):
    id = fields.Int(dump_only=True)
    account_name = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)