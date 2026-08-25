

from alembic import op
import sqlalchemy as sa


revision = "9a949e64d65e"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "fleet_owners",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            "account_name",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("fleet_owner_id", sa.Integer(), nullable=True),
        sa.Column(
            "username",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "phone",
            sa.String(length=13),
            nullable=False,
        ),
        sa.Column(
            "password_hash",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "role",
            sa.Enum("admin", "driver", name="user_role")
,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["fleet_owner_id"],
            ["fleet_owners.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("phone"),
        sa.UniqueConstraint("username"),
    )

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.create_index(
            batch_op.f("ix_users_fleet_owner_id"),
            ["fleet_owner_id"],
            unique=False,
        )


def downgrade():
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_index(
            batch_op.f("ix_users_fleet_owner_id")
        )

    op.drop_table("users")
    op.drop_table("fleet_owners")

