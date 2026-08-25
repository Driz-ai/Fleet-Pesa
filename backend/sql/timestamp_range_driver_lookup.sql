SELECT
    r.id AS remittance_id,
    r.vehicle_id,
    r.submitted_at,
    da.driver_id,
    da.assigned_from,
    da.assigned_to
FROM remittances r
JOIN driver_assignments da
    ON r.vehicle_id = da.vehicle_id
    AND r.submitted_at >= da.assigned_from
    AND (
        da.assigned_to IS NULL
        OR r.submitted_at <= da.assigned_to
    )
ORDER BY r.id;
