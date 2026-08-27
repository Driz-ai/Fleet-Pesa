from datetime import datetime, timezone

from extensions import db


class FarePayment(db.Model):
    __tablename__ = "fare_payments"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey("vehicles.id"),
        nullable=False
    )
    driver_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    transaction_reference = db.Column(db.String(100), unique=True)
    status = db.Column(db.String(20), nullable=False, default="pending")
    paid_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "driver_id": self.driver_id,
            "amount": float(self.amount),
            "payment_method": self.payment_method,
            "transaction_reference": self.transaction_reference,
            "status": self.status,
            "paid_at": self.paid_at.isoformat(),
        }
