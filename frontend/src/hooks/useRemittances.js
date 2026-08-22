import { useCallback } from "react";
import useFetch from "./useFetch";

function normalizePhone(phone) {
  return String(phone ?? "")
    .replace(/\s/g, "")
    .trim();
}

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

export default function useRemittance() {
  const {
    data,
    loading,
    error,
    get,
    post,
    reset,
  } = useFetch();

  // GET /remittances
  const getRemittances = useCallback(
    (params = {}) => {
      return get(
        `/remittances${buildQuery(params)}`
      );
    },
    [get]
  );

  // GET /remittances/:remittanceId
  const getRemittance = useCallback(
    (remittanceId) => {
      if (!remittanceId) {
        throw new Error("Remittance ID is required");
      }

      return get(
        `/remittances/${encodeURIComponent(remittanceId)}`
      );
    },
    [get]
  );

  // POST /remittances
  const submitRemittance = useCallback(
    ({
      amount,
      paymentPhone,
      vehicleId,
    } = {}) => {
      const numericAmount = Number(amount);

      if (
        amount === undefined ||
        amount === null ||
        amount === "" ||
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        throw new Error(
          "A valid remittance amount is required"
        );
      }

      if (!vehicleId) {
        throw new Error("Vehicle ID is required");
      }

      const phone = normalizePhone(paymentPhone);

      // Kenya:
      // 07XXXXXXXX
      // 01XXXXXXXX
      if (!/^(07|01)\d{8}$/.test(phone)) {
        throw new Error(
          "Enter a valid Kenyan phone number"
        );
      }

      return post("/remittances", {
        amount: numericAmount,
        payment_phone: phone,
        vehicle_id: vehicleId,
      });
    },
    [post]
  );

  // GET /drivers/me/remittances
  const getMyRemittances = useCallback(() => {
    return get("/drivers/me/remittances");
  }, [get]);

  // GET /drivers/me/remittances/:remittanceId
  const getMyRemittance = useCallback(
    (remittanceId) => {
      if (!remittanceId) {
        throw new Error(
          "Remittance ID is required"
        );
      }

      return get(
        `/drivers/me/remittances/${encodeURIComponent(
          remittanceId
        )}`
      );
    },
    [get]
  );

  // GET /drivers/me/remittances/today
  const getTodayRemittance = useCallback(() => {
    return get(
      "/drivers/me/remittances/today"
    );
  }, [get]);

  // GET /remittances/shortfalls
  const getShortfalls = useCallback(() => {
    return get("/remittances/shortfalls");
  }, [get]);

  // GET /drivers/me/shortfalls
  const getMyShortfalls = useCallback(() => {
    return get("/drivers/me/shortfalls");
  }, [get]);

  // POST /remittances/:remittanceId/resolve
  const resolveShortfall = useCallback(
    (remittanceId, resolutionData = {}) => {
      if (!remittanceId) {
        throw new Error(
          "Remittance ID is required"
        );
      }

      if (
        resolutionData === null ||
        typeof resolutionData !== "object" ||
        Array.isArray(resolutionData)
      ) {
        throw new Error(
          "Resolution information is required"
        );
      }

      return post(
        `/remittances/${encodeURIComponent(
          remittanceId
        )}/resolve`,
        resolutionData
      );
    },
    [post]
  );

  return {
    remittances: data,

    loading,
    error,

    getRemittances,
    getRemittance,
    submitRemittance,

    getMyRemittances,
    getMyRemittance,
    getTodayRemittance,

    getShortfalls,
    getMyShortfalls,
    resolveShortfall,

    reset,
  };
}