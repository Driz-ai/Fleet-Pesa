
import enum
import re

from datetime import datetime, timezone

from sqlalchemy.orm import validates

from extensions import db, bcrypt


class UserRole(enum.Enum):
    ADMIN = "admin"
    DRIVER = "driver"
    OWNER = "owner"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
    )

    fleet_owner_id = db.Column(
        db.Integer,
        db.ForeignKey("fleet_owners.id"),
        nullable=True,
        index=True,
    )

    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False,
    )

    name = db.Column(
        db.String(120),
        nullable=False,
    )

    phone = db.Column(
        db.String(15),
        unique=True,
        nullable=False,
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False,
    )

    role = db.Column(
        db.String(10),
        nullable=False,
        default=UserRole.DRIVER.value,

    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=db.func.now(),
    )

    notification_preference = db.Column(
        db.String(5),
        nullable=False,
        default="none",
        server_default="none",
    )

    fleet_owner = db.relationship(
        "FleetOwner",
        back_populates="users",
    )

    # --------------------------------------------------
    # Password
    # --------------------------------------------------

    def set_password(self, password):
        """Hash and store a user's password."""

        if not password:
            raise ValueError("Password is required.")

        if len(password) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        self.password_hash = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

    def check_password(self, password):
        """Check a plain-text password against the stored hash."""

        if not password:
            return False

        return bcrypt.check_password_hash(
            self.password_hash,
            password,
        )

    # --------------------------------------------------
    # Username
    # --------------------------------------------------

    @validates("username")
    def validate_username(self, key, value):
        if value is None:
            raise ValueError("Username is required.")

        value = value.strip()

        if not value:
            raise ValueError("Username is required.")

        return value

    # --------------------------------------------------
    # Name
    # --------------------------------------------------

    @validates("name")
    def validate_name(self, key, value):
        if value is None:
            raise ValueError("Name is required.")

        value = value.strip()

        if not value:
            raise ValueError("Name is required.")

        return value

    # --------------------------------------------------
    # Phone
    # --------------------------------------------------

    @validates("phone")
    def validate_phone(self, key, value):
        """
        Normalize Kenyan phone numbers to +254XXXXXXXXX.

 R       Accepted examples:
            0712345678
            0112345678
            254712345678
            +254712345678

        Stored as:
            +254712345678
        """

        if value is None:
            raise ValueError("Phone number is required.")

        value = value.strip()

        if not value:
            raise ValueError("Phone number is required.")

        # Remove common formatting characters.
        value = re.sub(r"[\s\-()]", "", value)

        # Convert 07XXXXXXXX / 01XXXXXXXX
        # to +2547XXXXXXXX / +2541XXXXXXXX
        if value.startswith(("07", "01")):
            value = "+254" + value[1:]

        # Convert 2547XXXXXXXX / 2541XXXXXXXX
        # to +2547XXXXXXXX / +2541XXXXXXXX
        elif value.startswith("254"):
            value = "+" + value

        # Validate final canonical format.
        if not re.fullmatch(r"\+254[17]\d{8}", value):
            raise ValueError(
                "Invalid Kenyan phone number. "
                "Use a valid number such as +254712345678."
            )

        return value

    # --------------------------------------------------
    # Serialization
    # --------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "phone": self.phone,
            "role": self.role,
            "fleet_owner_id": self.fleet_owner_id,
            "notification_preference": self.notification_preference,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
        }

    def __repr__(self):
        return f"<User {self.id} {self.username}>"
