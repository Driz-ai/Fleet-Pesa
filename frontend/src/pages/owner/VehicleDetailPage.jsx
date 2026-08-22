import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as api from "../../lib/api.js";
import { ArrowLeft, TriangleAlert, Loader2 } from "lucide-react";

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

if (error) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
      <TriangleAlert className="mx-auto mb-2 h-6 w-6 text-red-600" />
      <p className="text-sm font-semibold text-red-700">{error}</p>
      <Link
        to="/owner/dashboard"
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  );
}

if (!vehicle) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
      <p className="text-sm font-semibold text-slate-600">Vehicle not found.</p>
      <Link
        to="/owner/dashboard"
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  );
}
}