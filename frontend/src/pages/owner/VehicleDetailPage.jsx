import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as api from "../../lib/api.js";
import { Loader2 } from "lucide-react";

export default function VehicleDetailPage() {
  const { id } = useParams();

  return <div>Vehicle {id}</div>;

  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (timestamp) => {
  if (!timestamp) return "Not available";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const STATUS_TONE = {
  paid: "green",
  late: "amber",
  short: "red",
};

function statusLabel(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const [vehicle, setVehicle] = useState(null);
const [remittances, setRemittances] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  let isMounted = true;

  async function load() {
    setIsLoading(true);
    setError("");

    try {
      const [vehicleData, remittanceData] = await Promise.all([
        api.getVehicle(id),
        api.listRemittances({ vehicleId: id }),
      ]);

      if (!isMounted) return;
      setVehicle(vehicleData);
      setRemittances(
        Array.isArray(remittanceData) ? remittanceData : remittanceData?.remittances || []
      );
    } catch (err) {
      if (!isMounted) return;
      setError(err?.message || "Unable to load this vehicle right now. Please try again.");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }

  if (id) load();

  return () => {
    isMounted = false;
  };
}, [id]);

if (isLoading) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm font-medium">Loading vehicle details…</p>
    </div>
  );
}
}