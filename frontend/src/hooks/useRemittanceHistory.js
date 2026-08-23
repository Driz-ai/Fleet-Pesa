import { useEffect, useState } from "react";
import { getVehicleRemittanceHistory } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { MOCK_VEHICLES } from "../data/mockVehicles.js";

const MOCK_HISTORY = [
  { id: "mock-rem-1", submitted_at: "2026-08-22T14:10:00Z", expected_amount: 8500, actual_amount: 8500, status: "paid", payment_status: "confirmed" },
  { id: "mock-rem-2", submitted_at: "2026-08-21T14:25:00Z", expected_amount: 8500, actual_amount: 7000, status: "short", payment_status: "confirmed" },
];

export default function useRemittanceHistory(vehicleId, filters) {
  const { token } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", vehicle: null, remittances: [] });

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: "" }));
    const request = token?.startsWith("mock-token")
      ? new Promise((resolve) => window.setTimeout(() => {
          const vehicle = MOCK_VEHICLES.find((item) => item.id === vehicleId);
          resolve({
            vehicle: vehicle ? { id: vehicle.id, plate_number: vehicle.plate_number, vehicle_type: vehicle.type } : null,
            remittances: vehicleId === "mock-1" ? MOCK_HISTORY : [],
          });
        }, 250))
      : getVehicleRemittanceHistory(vehicleId, filters);
    request
      .then((data) => { if (!cancelled) setState({ loading: false, error: "", vehicle: data.vehicle, remittances: data.remittances || [] }); })
      .catch((error) => { if (!cancelled) setState({ loading: false, error: error.message, vehicle: null, remittances: [] }); });
    return () => { cancelled = true; };
  }, [token, vehicleId, filters]);

  return state;
}