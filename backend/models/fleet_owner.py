from datetime import datetime, timezone

from extensions import db


class FleetOwner(db.Model):
    __tablename__ = "fleet_owners"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True,
    )

    account_name = db.Column(
        db.String(150),
        nullable=False,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=db.func.now(),
    )

    users = db.relationship(
        "User",
        back_populates="fleet_owner",
    )

    def __repr__(self):
        return f"<FleetOwner {self.id} {self.account_name}>"
