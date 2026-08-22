"""Add notification preference to users.

Revision ID: 001_add_notification_preference
Revises:
"""

from alembic import op
import sqlalchemy as sa


revision = "001_add_notification_preference"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column("notification_preference", sa.String(length=5), nullable=False, server_default="none"),
    )


def downgrade():
    op.drop_column("users", "notification_preference")