import pytest

from models.fare_payment import FarePayment


def test_seeded_fare_payments_have_no_direct_driver_reference(seeded_app):
    with seeded_app.app_context():
        assert FarePayment.query.count() == 3
        assert not hasattr(FarePayment, "driver_id")
        assert all(item.vehicle_id is not None for item in FarePayment.query.all())


@pytest.mark.skip(reason="Gabriel's driver_lookup utility is not merged")
def test_fare_payment_driver_is_resolved_by_vehicle_and_timestamp():
    pass
