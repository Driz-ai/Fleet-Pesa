import os
from datetime import timedelta


class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///fleetpesa.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv( "JWT_SECRET_KEY", "development-only-secret")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=10)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # M-Pesa
    MPESA_CALLBACK_SECRET = os.getenv("MPESA_CALLBACK_SECRET", "")
