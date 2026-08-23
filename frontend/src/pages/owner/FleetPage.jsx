import { useCallback } from "react";
import useFetch from "./useFetch";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

function isValidObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  );
}

export default function useVehicles() {
  const {
    data,
    loading,
    error,
    get,
    post,
    put,
    patch,
    remove,
    reset,
  } = useFetch();

  const getVehicles = useCallback(
    (params = {}) => {
      return get(`/vehicles${buildQuery(params)}`);
    },
    [get]
  );

  const getVehicle = useCallback(
    (vehicleId) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      return get(`/vehicles/${encodeURIComponent(vehicleId)}`);
    },
    [get]
  );

  const createVehicle = useCallback(
    (vehicleData) => {
      if (!isValidObject(vehicleData)) {
        throw new Error("Vehicle information is required");
      }

      return post("/vehicles", vehicleData);
    },
    [post]
  );

  const updateVehicle = useCallback(
    (vehicleId, vehicleData) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      if (!isValidObject(vehicleData)) {
        throw new Error("Vehicle information is required");
      }

      return put(
        `/vehicles/${encodeURIComponent(vehicleId)}`,
        vehicleData
      );
    },
    [put]
  );

  const updateVehicleStatus = useCallback(
    (vehicleId, status) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      if (typeof status !== "string" || !status.trim()) {
        throw new Error("Vehicle status is required");
      }

      return patch(
        `/vehicles/${encodeURIComponent(vehicleId)}/status`,
        {
          status: status.trim(),
        }
      );
    },
    [patch]
  );

  const deleteVehicle = useCallback(
    (vehicleId) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      return remove(
        `/vehicles/${encodeURIComponent(vehicleId)}`
      );
    },
    [remove]
  );

  const getMyVehicles = useCallback(() => {
    return get("/owners/me/vehicles");
  }, [get]);

  return {
    vehicles: data,
    loading,
    error,
    getVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    deleteVehicle,
    getMyVehicles,
    reset,
  };
}