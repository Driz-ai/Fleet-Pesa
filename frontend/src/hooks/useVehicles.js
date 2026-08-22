import { useEffect, useState } from "react";
import * as api from "../lib/api.js";

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const data = await api.listVehicles();
        if (!isMounted) return;
        setVehicles(Array.isArray(data) ? data : data?.vehicles || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Unable to load vehicles right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { vehicles, isLoading, error };
}