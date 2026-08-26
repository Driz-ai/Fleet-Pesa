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
WHERE da.id = (
    SELECT da2.id
    FROM driver_assignments da2
    WHERE da2.vehicle_id = r.vehicle_id
      AND r.submitted_at >= da2.assigned_from
      AND (
          da2.assigned_to IS NULL
          OR r.submitted_at <= da2.assigned_to
      )
    ORDER BY da2.assigned_from DESC
    LIMIT 1
)
ORDER BY r.id;
