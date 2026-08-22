from datetime import datetime, timezone

from extensions import bcrypt, db


class User(db.Model):
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True, nullable=False)
	name = db.Column(db.String(120), nullable=False)
	phone = db.Column(db.String(15), unique=True, nullable=False)
	password_hash = db.Column(db.String(255), nullable=False)
	role = db.Column(db.String(10), nullable=False)
	notification_preference = db.Column(db.String(5), nullable=False, default="none", server_default="none")
	created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

	def set_password(self, password):
		self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

	def check_password(self, password):
		return bcrypt.check_password_hash(self.password_hash, password)

	def to_dict(self):
		return {
			"id": self.id,
			"username": self.username,
			"name": self.name,
			"phone": self.phone,
			"role": self.role,
			"notification_preference": self.notification_preference,
		}
