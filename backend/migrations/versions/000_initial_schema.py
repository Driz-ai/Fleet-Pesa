"""Create initial FleetPesa database schema.

Revision ID: 000_initial_schema
Revises:
"""

from alembic import op
import sqlalchemy as sa


revision = "000_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=15), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=10), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("username"),
        sa.UniqueConstraint("phone"),
    )

    op.create_table(
        "vehicles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("plate_number", sa.String(length=20), nullable=False),
        sa.Column("vehicle_type", sa.String(length=20), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["driver_id"], ["users.id"]),
        sa.UniqueConstraint("plate_number"),
    )

    op.create_table(
        "remittances",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("vehicle_id", sa.Integer(), nullable=False),
        sa.Column("driver_id", sa.Integer(), nullable=False),
        sa.Column("expected_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("actual_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.String(length=10), nullable=False),
        sa.Column(
            "payment_status",
            sa.String(length=15),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("mpesa_reference", sa.String(length=50)),
        sa.Column("mpesa_transaction_code", sa.String(length=20)),
        sa.Column("flagged_for_followup", sa.Boolean(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"]),
        sa.ForeignKeyConstraint(["driver_id"], ["users.id"]),
    )


def downgrade():
    op.drop_table("remittances")
    op.drop_table("vehicles")
    op.drop_table("users")
