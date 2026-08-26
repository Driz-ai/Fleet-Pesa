from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
from datetime import timezone,datetime
from extensions import db
from models.user import User, UserRole
from models.vehicle import Vehicle
from models.driver_assignment import DriverAssignment
from schemas.driver_assignment_schema import driver_assignment_schema,driver_assignments_schema

class DriverAssignments(Resource):

    def post(self):
        try:
            data = driver_assignment_schema.load(
                request.get_json()
            )
        except ValidationError as error:
            return {
                "errors": error.messages
            }, 400

        driver_id = data["driver_id"]
        vehicle_id = data["vehicle_id"]
        driver = db.session.get(User, driver_id)

        if driver is None:
            return {
                "error": "Driver not found."
            }, 404
        if driver.role != UserRole.DRIVER:
            return {
                "error": "Selected user is not a driver."
            }, 400

        vehicle = db.session.get(Vehicle, vehicle_id)

        if vehicle is None:
            return {
                "error": "Vehicle not found."
            }, 404

        existing_vehicle_assignment = (
            DriverAssignment.query
            .filter_by(
                vehicle_id=vehicle_id,
                unassigned_at=None,
            )
            .first()
        )
        if existing_vehicle_assignment:
            return {
                "error": "Vehicle already has an assigned driver."
            }, 409

        existing_driver_assignment = (
            DriverAssignment.query
            .filter_by(
                driver_id=driver_id,
                unassigned_at=None,
            )
            .first()
        )
        if existing_driver_assignment:
            return {
                "error": "Driver is already assigned to a vehicle."
            }, 409

        assignment = DriverAssignment(
            driver_id=driver_id,
            vehicle_id=vehicle_id,
        )

        db.session.add(assignment)
        db.session.commit()
        return (
            driver_assignment_schema.dump(assignment),
            201,
        )
    def get(self):
      assignments = DriverAssignment.query.all()

      return (
        driver_assignments_schema.dump(assignments),
        200,
    )

class DriverAssignmentById(Resource):
     def get(self, id):
        assignment = db.session.get(
            DriverAssignment,
            id,
        )
        if assignment is None:
            return {
                "error": "Driver assignment not found."
            }, 404
        return (
            driver_assignment_schema.dump(assignment),
            200,
        )
class UnassignDriver(Resource):
    def patch(self, id):
        assignment = db.session.get(
            DriverAssignment,
            id,
        )
        if assignment is None:
            return {
                "error": "Driver assignment not found."
            }, 404
        if assignment.unassigned_at is not None:
            return {
                "error": "Driver is already unassigned."
            }, 409

        assignment.unassigned_at = datetime.now(timezone.utc)

        db.session.commit()
        return (
            driver_assignment_schema.dump(assignment),
            200,
        )