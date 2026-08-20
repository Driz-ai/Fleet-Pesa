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

export default {
  login,
  register,
};