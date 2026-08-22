import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Car, Loader2, TriangleAlert } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles.js";

export default function FleetPage() {
  const { vehicles: fetchedVehicles, loading, error, getVehicles } = useVehicles();
  const vehicles = Array.isArray(fetchedVehicles) ? fetchedVehicles : [];

  useEffect(() => {
    getVehicles().catch(() => {});
  }, [getVehicles]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm font-medium">Loading fleet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
        <TriangleAlert className="mx-auto mb-2 h-6 w-6 text-red-600" />
        <p className="text-sm font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        No vehicles found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <Link
          key={vehicle.id}
          to={`/owner/vehicles/${vehicle.id}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {vehicle.plate_number || "Unregistered"}
            </p>
            <p className="text-xs text-slate-500">{vehicle.type || "Vehicle"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}