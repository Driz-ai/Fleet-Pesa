from marshmallow import Schema, fields, validate


class UserProfileSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=2, max=120))
    phone = fields.Str(required=False, validate=validate.Regexp(r"^\+?\d{10,15}$"))


profile_schema = UserProfileSchema()


class PasswordChangeSchema(Schema):
    current_password = fields.Str(required=True, validate=validate.Length(min=1))
    new_password = fields.Str(required=True, validate=validate.Length(min=6, max=128))


password_change_schema = PasswordChangeSchema()
