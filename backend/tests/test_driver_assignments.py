import pytest

from models.driver_assignment import DriverAssignment
from models.vehicle import Vehicle


def test_kaa_assignment_history_has_closed_and_open_rows(seeded_app):
    with seeded_app.app_context():
        vehicle = Vehicle.query.filter_by(plate_number="KAA 123X").one()
        history = DriverAssignment.query.filter_by(
            vehicle_id=vehicle.id
        ).order_by(DriverAssignment.assigned_at).all()
        assert len(history) == 2
        assert history[0].unassigned_at is not None
        assert history[1].unassigned_at is None


@pytest.mark.skip(reason="Munira's assign-driver endpoint is not merged")
def test_reassignment_closes_old_assignment_and_opens_new_one():
    pass
