from marshmallow import Schema, fields, validate


class UserProfileSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=2, max=120))
    phone = fields.Str(required=False, validate=validate.Regexp(r"^\+?\d{10,15}$"))


profile_schema = UserProfileSchema()
