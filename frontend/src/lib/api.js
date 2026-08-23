const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Core fetch wrapper — handles JSON headers, auth token, and error parsing.
 * Throws an Error with a readable message on non-2xx responses.
 */
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("fleetpesa_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error("Network error — check your connection and try again.");
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

// ---- Auth ----

export function login({ role, phone, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { role, phone, password },
    auth: false,
  });
}

export function register({ role, username, name, phone, password }) {
  return request("/auth/register", {
    method: "POST",
    body: { role, username, name, phone, password },
    auth: false,
  });
}

export function updateProfile({ name, phone, notification_preference }) {
  const body = { name, phone };
  if (notification_preference !== undefined) body.notification_preference = notification_preference;
  return request("/users/me", { method: "PATCH", body });
}

export function updatePassword({ currentPassword, newPassword }) {
  return request("/users/me/password", {
    method: "PATCH",
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

// Expected password recovery contract: the backend sends a six-digit OTP to phone.
export function requestPasswordOtp({ phone }) {
  return request("/auth/password/otp/request", {
    method: "POST",
    body: { phone },
    auth: false,
  });
}

export function verifyPasswordOtp({ phone, otp }) {
  return request("/auth/password/otp/verify", {
    method: "POST",
    body: { phone, otp },
    auth: false,
  });
}

export function resetPassword({ phone, resetToken, password }) {
  return request("/auth/password/reset", {
    method: "POST",
    body: { phone, reset_token: resetToken, password },
    auth: false,
  });
}

// Frontend-only mock for remittance shortfall updates until the backend exposes this endpoint.
export function updateRemittance(remittanceId, updates = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: remittanceId,
        ...updates,
        updated_at: new Date().toISOString(),
        status: "resolved",
      });
    }, 400);
  });
}

export function getVehicle(vehicleId) {
  return request(`/vehicles/${encodeURIComponent(vehicleId)}`);
}

export function listVehicles() {
  return request("/vehicles");
}

export function listRemittances({ vehicleId, driverId } = {}) {
  const params = new URLSearchParams();
  if (vehicleId) params.set("vehicle_id", vehicleId);
  if (driverId) params.set("driver_id", driverId);

  const query = params.toString();
  return request(`/remittances${query ? `?${query}` : ""}`);
}

export function getVehicleRemittanceHistory(vehicleId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  const query = params.toString();
  return request(`/vehicles/${encodeURIComponent(vehicleId)}/remittances${query ? `?${query}` : ""}`);
}

export default {
  login,
  register,
  requestPasswordOtp,
  verifyPasswordOtp,
  resetPassword,
  updateRemittance,
  getVehicle,
  listVehicles,
  listRemittances,
  getVehicleRemittanceHistory,
};