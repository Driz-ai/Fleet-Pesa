import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Car, Loader2, TriangleAlert } from "lucide-react";
import useVehicles from "../../hooks/useVehicles.js";

export default function FleetPage() {
  const {
    vehicles = [],
    loading,
    error,
    getVehicles,
  } = useVehicles();

  useEffect(() => {
    getVehicles();
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

        <p className="text-sm font-semibold text-red-700">
          {typeof error === "string"
            ? error
            : error?.message || "Failed to load vehicles."}
        </p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <Car className="mx-auto mb-3 h-8 w-8 text-slate-400" />

        <p className="text-sm font-semibold text-slate-700">
          No vehicles found.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Your fleet is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Owner workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          My Fleet
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your vehicles and keep your fleet accounted for.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            to={`/owner/vehicles/${vehicle.id}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
              <Car className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {vehicle.plate_number || "Unregistered"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {vehicle.type || "Vehicle"}
              </p>

              {vehicle.driver_name && (
                <p className="mt-1 truncate text-xs text-slate-400">
                  Driver: {vehicle.driver_name}
                </p>
              )}
            </div>

            <div className="ml-auto shrink-0">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  vehicle.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {vehicle.status === "active" ? "Active" : "Parked"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}