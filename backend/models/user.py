import enum
import re

from datetime import datetime, timezone

from sqlalchemy.orm import validates

from extensions import db, bcrypt


class UserRole(enum.Enum):
    OWNER = "owner"
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

    # Kenyan phone number stored as:
    # 0712345678
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
    driver_assignments = db.relationship(
    "DriverAssignment",
    back_populates="driver",
)

    # ==========================================================
    # PASSWORD
    # ==========================================================

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

        if not self.password_hash:
            return False

        return bcrypt.check_password_hash(
            self.password_hash,
            password,
        )

    # ==========================================================
    # USERNAME
    # ==========================================================

    @validates("username")
    def validate_username(self, key, value):
        if value is None:
            raise ValueError("Username is required.")

        value = str(value).strip()

        if not value:
            raise ValueError("Username is required.")

        if len(value) < 3:
            raise ValueError(
                "Username must be at least 3 characters long."
            )

        if len(value) > 100:
            raise ValueError(
                "Username must not exceed 100 characters."
            )

        return value

    # ==========================================================
    # NAME
    # ==========================================================

    @validates("name")
    def validate_name(self, key, value):
        if value is None:
            raise ValueError("Name is required.")

        value = str(value).strip()

        if not value:
            raise ValueError("Name is required.")

        if len(value) > 150:
            raise ValueError(
                "Name must not exceed 150 characters."
            )

        return value

    # ==========================================================
    # PHONE
    # ==========================================================

    @validates("phone")
    def validate_phone(self, key, value):
        """
        Normalize Kenyan mobile numbers to 07XXXXXXXX.

        Accepted:

            0712345678
            +254712345678
            254712345678
            0712 345 678
            0712-345-678

        Stored in database as:

            0712345678
        """

        if value is None:
            raise ValueError("Phone number is required.")

        value = str(value).strip()

        if not value:
            raise ValueError("Phone number is required.")

        # Remove spaces, dashes and brackets.
        value = re.sub(r"[\s\-()]", "", value)

        # ------------------------------------------------------
        # +254712345678 -> 0712345678
        # ------------------------------------------------------

        if value.startswith("+254"):
            value = "0" + value[4:]

        # ------------------------------------------------------
        # 254712345678 -> 0712345678
        # ------------------------------------------------------

        elif value.startswith("254"):
            value = "0" + value[3:]

        # ------------------------------------------------------
        # Validate Kenyan mobile number.
        #
        # Currently accepting:
        # 07XXXXXXXX
        # ------------------------------------------------------

        if not re.fullmatch(r"07\d{8}", value):
            raise ValueError(
                "Invalid Kenyan phone number. "
                "Use a valid number such as 0712345678."
            )

        return value

    # ==========================================================
    # SERIALIZATION
    # ==========================================================

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

    # ==========================================================
    # REPRESENTATION
    # ==========================================================

    def __repr__(self):
        return f"<User {self.id} {self.username}>"
