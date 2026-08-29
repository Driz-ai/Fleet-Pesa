from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from config import Config
from extensions import api, bcrypt, db, jwt, migrate
from models.user import User
from routes.auth_routes import LoginResource, SignupResource

from routes.fare_payment_routes import (
    FarePaymentCallback,
    FarePaymentCreate,
    FarePaymentDetail,
)
from routes.driver_assignment_routes import (
    DriverAssignmentById,
    DriverAssignments,
    UnassignDriver,
    VehicleDriverAssignment,
    VehicleDriverHistory,
)
from routes.remittance_routes import (
    RemittanceDetail,
    RemittanceList,
    RemittancePrompt,
    VehicleRemittanceHistory,
)
from routes.vehicle_routes import VehicleDetail, VehicleList



class Health(Resource):
    def get(self):
        return {"message": "Fleet-Pesa API is running"}, 200




def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    api.add_resource(SignupResource, "/api/auth/signup")
    api.add_resource(LoginResource, "/api/auth/login")
    api.add_resource(DriverAssignments, "/api/driver-assignments")
    api.add_resource(DriverAssignmentById, "/api/driver-assignments/<int:id>")
    api.add_resource(UnassignDriver, "/api/driver-assignments/<int:id>/unassign")
    api.add_resource(
        VehicleDriverAssignment,
        "/api/vehicles/<int:vehicle_id>/assign-driver",
    )
    api.add_resource(
        VehicleDriverHistory,
        "/api/vehicles/<int:vehicle_id>/driver-history",
    )
    api.add_resource(VehicleList, "/api/vehicles")
    api.add_resource(VehicleDetail, "/api/vehicles/<int:vehicle_id>")
    api.add_resource(
        VehicleRemittanceHistory,
        "/api/vehicles/<int:vehicle_id>/remittances",
    )
    api.add_resource(RemittanceList, "/api/remittances")
    api.add_resource(RemittanceDetail, "/api/remittances/<int:remittance_id>")
    api.add_resource(RemittancePrompt, "/api/remittances/<int:remittance_id>/prompt")
    api.add_resource(FarePaymentCreate, "/api/fare-payments")
    api.add_resource(FarePaymentDetail, "/api/fare-payments/<int:payment_id>")
    api.add_resource(FarePaymentCallback, "/api/fare-payments/mpesa-callback")

    api.add_resource(Health, "/")
    
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    return app


app = create_app()


# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

