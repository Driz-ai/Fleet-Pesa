import { useCallback } from "react";
import useFetch from "./useFetch";

export default function useDriver() {
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

  // GET /drivers
  const getDrivers = useCallback(
    (params = {}) => {
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

      return get(
        `/drivers${queryString ? `?${queryString}` : ""}`
      );
    },
    [get]
  );

  // GET /drivers/me
  const getCurrentDriver = useCallback(() => {
    return get("/drivers/me");
  }, [get]);

  // GET /drivers/:driverId
  const getDriver = useCallback(
    (driverId) => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      return get(
        `/drivers/${encodeURIComponent(driverId)}`
      );
    },
    [get]
  );

  // POST /drivers
  const createDriver = useCallback(
    (driverData) => {
      if (
        !driverData ||
        typeof driverData !== "object" ||
        Array.isArray(driverData) ||
        Object.keys(driverData).length === 0
      ) {
        throw new Error("Driver information is required");
      }

      return post("/drivers", driverData);
    },
    [post]
  );

  // PUT /drivers/:driverId
  const updateDriver = useCallback(
    (driverId, driverData) => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      if (
        !driverData ||
        typeof driverData !== "object" ||
        Array.isArray(driverData) ||
        Object.keys(driverData).length === 0
      ) {
        throw new Error("Driver information is required");
      }

      return put(
        `/drivers/${encodeURIComponent(driverId)}`,
        driverData
      );
    },
    [put]
  );

  // PATCH /drivers/me
  const updateCurrentDriver = useCallback(
    (driverData) => {
      if (
        !driverData ||
        typeof driverData !== "object" ||
        Array.isArray(driverData) ||
        Object.keys(driverData).length === 0
      ) {
        throw new Error("Driver information is required");
      }

      return patch("/drivers/me", driverData);
    },
    [patch]
  );

  // DELETE /drivers/:driverId
  const deleteDriver = useCallback(
    (driverId) => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      return remove(
        `/drivers/${encodeURIComponent(driverId)}`
      );
    },
    [remove]
  );

  // GET /drivers/me/dashboard
  const getDriverDashboard = useCallback(() => {
    return get("/drivers/me/dashboard");
  }, [get]);

  // GET /drivers/:driverId/remittance-summary
  const getDriverRemittanceSummary = useCallback(
    (driverId) => {
      if (!driverId) {
        throw new Error("Driver ID is required");
      }

      return get(
        `/drivers/${encodeURIComponent(
          driverId
        )}/remittance-summary`
      );
    },
    [get]
  );

  return {
    data,

    loading,
    error,

    getDrivers,
    getCurrentDriver,
    getDriver,

    createDriver,
    updateDriver,
    updateCurrentDriver,
    deleteDriver,

    getDriverDashboard,
    getDriverRemittanceSummary,

    reset,
  };
}