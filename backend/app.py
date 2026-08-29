from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import api, bcrypt, db, jwt, migrate
from models.user import User

from routes.auth_routes import Login, Me, Refresh, Signup,UpdateProfile,ChangePassword
from routes.driver_assignment_routes import (
    DriverAssignmentById,
    DriverAssignments,
    UnassignDriver,
    VehicleDriverHistory,
)
from routes.fare_payment_routes import (
    FarePaymentCallback,
    FarePaymentDetail,
    FarePaymentList,
    FarePaymentCreate
)
from routes.remittance_routes import (
    RemittanceDetail,
    RemittanceList,
    RemittancePrompt,
    VehicleRemittanceHistory,
)
from routes.vehicle_routes import VehicleDetail, VehicleList
from routes.system_routes import Health

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    api.add_resource(Signup, "/auth/signup")
    api.add_resource(Login, "/auth/login")
    api.add_resource(Refresh, "/auth/refresh")
    api.add_resource(Me, "/auth/me")
    api.add_resource(DriverAssignments, "/driver-assignments")
    api.add_resource(DriverAssignmentById, "/driver-assignments/<int:id>")
    api.add_resource(UnassignDriver, "/driver-assignments/<int:id>/unassign")
    api.add_resource(
        VehicleDriverHistory,
        "/vehicles/<int:vehicle_id>/driver-history",
    )
    api.add_resource(VehicleList, "/vehicles")
    api.add_resource(VehicleDetail, "/vehicles/<int:vehicle_id>")
    api.add_resource(
        VehicleRemittanceHistory,
        "/vehicles/<int:vehicle_id>/remittances",
    )
    api.add_resource(RemittancePrompt, "/remittances/<int:remittance_id>/prompt")
    api.add_resource(RemittanceList, "/remittances")
    api.add_resource(RemittanceDetail, "/remittances/<int:remittance_id>")
    api.add_resource(FarePaymentList, "/fare-payments")
    api.add_resource(FarePaymentDetail, "/fare-payments/<int:payment_id>")
    api.add_resource(FarePaymentCallback, "/fare-payments/mpesa-callback")
    api.add_resource(FarePaymentCreate, "/fare-payments")
    api.add_resource(Health, "/")
    api.add_resource(UpdateProfile, "/users/me")
    api.add_resource(ChangePassword, "/users/me/password")

    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5555,debug=True)
