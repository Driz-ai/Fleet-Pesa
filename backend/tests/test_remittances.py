import pytest

from models.remittance import Remittance


def test_seeded_remittances_have_no_direct_driver_reference(seeded_app):
    with seeded_app.app_context():
        assert Remittance.query.count() == 3
        assert not hasattr(Remittance, "driver_id")
        assert all(item.vehicle_id is not None for item in Remittance.query.all())


@pytest.mark.skip(reason="Gabriel's driver_lookup utility is not merged")
def test_remittance_driver_is_resolved_by_vehicle_and_timestamp():
    pass


@pytest.mark.skip(reason="Gabriel's driver_lookup utility is not merged")
def test_remittance_lookup_handles_reassignment_boundary():
    pass
