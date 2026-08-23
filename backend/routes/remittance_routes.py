from datetime import datetime, time

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.remittance import Remittance
from models.vehicle import Vehicle

remittance_bp = Blueprint("remittances", __name__, url_prefix="/api")


@remittance_bp.get("/vehicles/<int:vehicle_id>/remittances")
@jwt_required()
def vehicle_remittance_history(vehicle_id):
	user_id = int(get_jwt_identity())
	vehicle = db.session.get(Vehicle, vehicle_id)
	if vehicle is None:
		return jsonify(message="Vehicle not found"), 404
	if vehicle.owner_id != user_id and vehicle.driver_id != user_id:
		return jsonify(message="You do not have access to this vehicle"), 403

	query = Remittance.query.filter_by(vehicle_id=vehicle_id)
	status = request.args.get("status")
	if status and status != "all":
		if status not in ("paid", "short"):
			return jsonify(message="status must be paid, short or all"), 400
		query = query.filter_by(status=status)
	try:
		if request.args.get("from"):
			query = query.filter(Remittance.submitted_at >= datetime.fromisoformat(request.args["from"]).replace(tzinfo=None))
		if request.args.get("to"):
			end_date = datetime.fromisoformat(request.args["to"]).date()
			query = query.filter(Remittance.submitted_at <= datetime.combine(end_date, time.max))
	except ValueError:
		return jsonify(message="from and to must use YYYY-MM-DD format"), 400

	return jsonify(
		vehicle={"id": vehicle.id, "plate_number": vehicle.plate_number, "vehicle_type": vehicle.vehicle_type},
		remittances=[item.to_dict() for item in query.order_by(Remittance.submitted_at.desc()).all()],
	)
