import { useEffect, useState } from "react";
import { getVehicleRemittanceHistory } from "../lib/api.js";

export default function useRemittanceHistory(vehicleId, filters) {
  const [state, setState] = useState({ loading: true, error: "", vehicle: null, remittances: [] });

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: "" }));
    getVehicleRemittanceHistory(vehicleId, filters)
      .then((data) => { if (!cancelled) setState({ loading: false, error: "", vehicle: data.vehicle, remittances: data.remittances || [] }); })
      .catch((error) => { if (!cancelled) setState({ loading: false, error: error.message, vehicle: null, remittances: [] }); });
    return () => { cancelled = true; };
  }, [vehicleId, filters]);

  return state;
}