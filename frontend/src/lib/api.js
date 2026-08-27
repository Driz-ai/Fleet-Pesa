import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// ============================================================
// TOKEN HELPERS
// ============================================================

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}


// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ============================================================
// LOGIN
// ============================================================

export async function login({ phone, password }) {
  try {
    const response = await api.post("/auth/login", {
      phone,
      password,
    });

    const data = response.data;

    saveTokens(
      data.access_token,
      data.refresh_token
    );

    return data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Invalid phone number or password.";

    throw new Error(message);
  }
}


// ============================================================
// REGISTER
// ============================================================

export async function register({
  username,
  name,
  phone,
  password,
}) {
  try {
    const response = await api.post("/auth/register", {
      username,
      name,
      phone,
      password,
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Unable to create account.";

    throw new Error(message);
  }
}


// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Unable to load user account.";

    throw new Error(message);
  }
}


// ============================================================
// REFRESH TOKEN
// ============================================================

export async function refreshAccessToken() {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const response = await api.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const accessToken = response.data.access_token;

    if (accessToken) {
      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
      );
    }

    return accessToken;
  } catch (error) {
    clearTokens();

    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Session expired. Please log in again.";

    throw new Error(message);
  }
}


// ============================================================
// UPDATE PROFILE
// ============================================================
//
// IMPORTANT:
// Change "/profile" below if your Flask backend uses a
// different profile endpoint.
// ============================================================

export async function updateProfile(profileData) {
  try {
    const response = await api.put(
      "/profile",
      profileData
    );

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Unable to update profile.";

    throw new Error(message);
  }
}


// ============================================================
// UPDATE PASSWORD
// ============================================================
//
// IMPORTANT:
// Change "/profile/password" below if your Flask backend
// uses a different password endpoint.
// ============================================================

export async function updatePassword(passwordData) {
  try {
    const response = await api.put(
      "/profile/password",
      passwordData
    );

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Unable to update password.";

    throw new Error(message);
  }
}


// ============================================================
// VEHICLE REMITTANCE HISTORY
// ============================================================
//
// IMPORTANT:
// Change this endpoint if your Flask backend uses a
// different URL.
// ============================================================

export async function getVehicleRemittanceHistory(
  vehicleId
) {
  try {
    const response = await api.get(
      `/vehicles/${vehicleId}/remittance-history`
    );

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Unable to load remittance history.";

    throw new Error(message);
  }
}


// ============================================================
// LOGOUT
// ============================================================

export function logout() {
  clearTokens();
}


export default api;
