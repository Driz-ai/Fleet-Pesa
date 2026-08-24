import { useCallback, useEffect, useState } from "react";
import * as api from "../lib/api.js";

function isValidObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}

function extractVehicles(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isValidObject(payload)) {
    return [];
  }

  if (Array.isArray(payload.vehicles)) {
    return payload.vehicles;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
}

export default function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.listVehicles();
      const nextVehicles = extractVehicles(response);

      setVehicles(nextVehicles);
      return nextVehicles;
    } catch (err) {
      const message =
        err?.message || "Failed to load vehicles.";

      setError(message);
      setVehicles([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (vehicleOrId) => {
    const vehicleId =
      typeof vehicleOrId === "object"
        ? vehicleOrId?.id
        : vehicleOrId;

    if (!vehicleId) {
      throw new Error("Vehicle ID is required.");
    }

    await api.deleteVehicle(vehicleId);

    setVehicles((current) =>
      current.filter((vehicle) => vehicle.id !== vehicleId)
    );
  }, []);

  useEffect(() => {
    getVehicles();
  }, [getVehicles]);

  return {
    vehicles,
    loading,
    error,
    getVehicles,
    deleteVehicle,
  };
}
