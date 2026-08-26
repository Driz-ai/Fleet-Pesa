import enum
import re

from datetime import datetime, timezone

from sqlalchemy.orm import validates

from extensions import db, bcrypt


class UserRole(enum.Enum):
    ADMIN = "admin"
    DRIVER = "driver"


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
        db.String(100),
        unique=True,
        nullable=False,
    )

    name = db.Column(
        db.String(150),
        nullable=False,
    )

    phone = db.Column(
        db.String(13),
        unique=True,
        nullable=False,
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False,
    )

    role = db.Column(
    db.Enum(
        UserRole,
        name="user_role",
        values_callable=lambda enum_class: [member.value for member in enum_class],
    ),
    nullable=False,
    default=UserRole.DRIVER,
)
 

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=db.func.now(),
    )

    
    fleet_owner = db.relationship(
        "FleetOwner",
        back_populates="users",
    )

    

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
        """Verify a plain-text password against the stored hash."""

        if not password:
            return False

        return bcrypt.check_password_hash(
            self.password_hash,
            password,
        )

    

    @validates("username")
    def validate_username(self, key, value):
        """Validate and normalize username."""

        if value is None:
            raise ValueError("Username is required.")

        value = value.strip()

        if not value:
            raise ValueError("Username is required.")

        if len(value) < 3:
            raise ValueError(
                "Username must contain at least 3 characters."
            )

        return value

    @validates("name")
    def validate_name(self, key, value):
        """Validate and normalize user's name."""

        if value is None:
            raise ValueError("Name is required.")

        value = value.strip()

        if not value:
            raise ValueError("Name is required.")

        if len(value) < 2:
            raise ValueError(
                "Name must contain at least 2 characters."
            )

        return value

    @validates("phone")
    def validate_phone(self, key, value):
        """Normalize and validate a Kenyan phone number."""

        if value is None:
            raise ValueError("Phone number is required.")

        value = value.strip()

        if not value:
            raise ValueError("Phone number is required.")

       
        value = re.sub(r"[\s\-()]", "", value)

        
        if value.startswith(("07", "01")):
            value = "+254" + value[1:]

        
        elif value.startswith("254"):
            value = "+" + value

        
        if not re.fullmatch(r"\+254[17]\d{8}", value):
            raise ValueError(
                "Invalid Kenyan phone number. "
                "Use a valid number such as +254712345678."
            )

        return value

    

    def to_dict(self):
        """Return a JSON-serializable representation of the user."""

        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "phone": self.phone,
            "role": self.role.value if self.role else None,
            "fleet_owner_id": self.fleet_owner_id,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
        }

    

    def __repr__(self):
        return f"<User {self.id} {self.username}>"

