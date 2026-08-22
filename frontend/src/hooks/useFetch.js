import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const request = useCallback(async (endpoint, options = {}) => {
    // Cancel previous request
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const {
        method = "GET",
        body,
        headers = {},
        ...fetchOptions
      } = options;

      const token = localStorage.getItem("fleetpesa_token");

      const isFormData = body instanceof FormData;

      const requestHeaders = {
        Accept: "application/json",
        ...headers,
      };

      // Let the browser set Content-Type for FormData.
      if (!isFormData && !requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }

      // Authentication
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body:
          body !== undefined &&
          body !== null &&
          method !== "GET" &&
          method !== "HEAD"
            ? isFormData
              ? body
              : JSON.stringify(body)
            : undefined,
        signal: controller.signal,
        ...fetchOptions,
      });

      // Handle empty responses such as 204 No Content
      let responseData = null;

      if (response.status !== 204) {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      }

      // Handle HTTP errors
      if (!response.ok) {
        const message =
          responseData?.message ||
          responseData?.error ||
          `Request failed with status ${response.status}`;

        throw new Error(message);
      }

      // Only update state if this request is still active
      if (!controller.signal.aborted) {
        setData(responseData);
      }

      return responseData;
    } catch (err) {
      // Abort is intentional
      if (err?.name === "AbortError") {
        return null;
      }

      const message =
        err?.message || "Something went wrong. Please try again.";

      setError(message);

      throw err;
    } finally {
      // Only the current request should control loading
      if (
        abortControllerRef.current === controller &&
        !controller.signal.aborted
      ) {
        setLoading(false);
      }
    }
  }, []);

  const get = useCallback(
    (endpoint, options = {}) =>
      request(endpoint, {
        ...options,
        method: "GET",
      }),
    [request]
  );

  const post = useCallback(
    (endpoint, body, options = {}) =>
      request(endpoint, {
        ...options,
        method: "POST",
        body,
      }),
    [request]
  );

  const put = useCallback(
    (endpoint, body, options = {}) =>
      request(endpoint, {
        ...options,
        method: "PUT",
        body,
      }),
    [request]
  );

  const patch = useCallback(
    (endpoint, body, options = {}) =>
      request(endpoint, {
        ...options,
        method: "PATCH",
        body,
      }),
    [request]
  );

  const remove = useCallback(
    (endpoint, options = {}) =>
      request(endpoint, {
        ...options,
        method: "DELETE",
      }),
    [request]
  );

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data,
    loading,
    error,

    request,

    get,
    post,
    put,
    patch,
    remove,

    reset,
  };
}