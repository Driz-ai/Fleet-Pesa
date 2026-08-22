import { useCallback } from "react";
import useFetch from "./useFetch";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
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

function useVehicles() {
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

  // GET /vehicles
  const getVehicles = useCallback(
    (params = {}) => {
      return get(`/vehicles${buildQuery(params)}`);
    },
    [get]
  );

  // GET /vehicles/:vehicleId
  const getVehicle = useCallback(
    (vehicleId) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      return get(
        `/vehicles/${encodeURIComponent(vehicleId)}`
      );
    },
    [get]
  );

  // POST /vehicles
  const createVehicle = useCallback(
    (vehicleData) => {
      if (!isValidObject(vehicleData)) {
        throw new Error("Vehicle information is required");
      }

      return post("/vehicles", vehicleData);
    },
    [post]
  );

  // PUT /vehicles/:vehicleId
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

  // PATCH /vehicles/:vehicleId/status
  const updateVehicleStatus = useCallback(
    (vehicleId, status) => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      if (
        typeof status !== "string" ||
        !status.trim()
      ) {
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

  // DELETE /vehicles/:vehicleId
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

  // GET /owners/me/vehicles
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

export { useVehicles };
export default useVehicles;