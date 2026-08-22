import { useEffect, useMemo, useState } from "react";
import { Car, Plus, Search, Trash2, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_VEHICLES } from "../../data/mockVehicles.js";
import StatusBadge from "../../components/shared/StatusBadge.jsx";

const INITIAL_FORM = {
  plate_number: "",
  type: "",
  driver_name: "",
  daily_expected_amount: "",
};

const LEGACY_TYPE_MAP = {
  "Nissan Caravan": "Isuzu NQR",
  "Toyota Noah": "Hino 300",
  "Isuzu NPR": "Isuzu NQR",
  "Toyota Probox": "Mitsubishi Fuso Canter",
  "Mitsubishi Canter": "Mitsubishi Fuso Canter",
};

function migrateVehicles(vehicles) {
  if (!Array.isArray(vehicles)) return MOCK_VEHICLES;

  return vehicles.map((vehicle) => ({
    ...vehicle,
    plate_number: vehicle.plate_number?.replace(/^KDO\b/, "KDR"),
    type: LEGACY_TYPE_MAP[vehicle.type] || vehicle.type,
  }));
}

function getStoredVehicles() {
  try {
    const stored = localStorage.getItem("fleetpesa_mock_vehicles");
    return stored ? migrateVehicles(JSON.parse(stored)) : MOCK_VEHICLES;
  } catch {
    return MOCK_VEHICLES;
  }
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState(getStoredVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    localStorage.setItem("fleetpesa_mock_vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return vehicles;

    return vehicles.filter((vehicle) =>
      [vehicle.plate_number, vehicle.type, vehicle.driver_name, vehicle.status]
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [searchTerm, vehicles]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const addVehicle = (event) => {
    event.preventDefault();
    const plateNumber = form.plate_number.trim().toUpperCase();
    if (!/^KD[A-Z] \d{3}[A-Z]$/.test(plateNumber) || !form.type.trim()) return;

    setVehicles((current) => [
      {
        id: `mock-${Date.now()}`,
        plate_number: plateNumber,
        type: form.type.trim(),
        driver_name: form.driver_name.trim() || "Unassigned",
        driver_phone: "",
        status: "available",
        daily_expected_amount: Number(form.daily_expected_amount) || 0,
      },
      ...current,
    ]);
    setForm(INITIAL_FORM);
    setIsAddOpen(false);
  };

  const removeVehicle = (vehicle) => {
    if (window.confirm(`Remove ${vehicle.plate_number} from this fleet?`)) {
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Owner workspace</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">My fleet</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your vehicles and keep every route accounted for.</p>
        </div>
        <button type="button" onClick={() => setIsAddOpen((open) => !open)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          {isAddOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAddOpen ? "Close form" : "Add vehicle"}
        </button>
      </div>

      {isAddOpen && (
        <form onSubmit={addVehicle} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Add a vehicle</h2>
            <p className="mt-1 text-sm text-slate-500">Use a registration in the format KDJ 123A through KDZ 999Z.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Registration<input required name="plate_number" value={form.plate_number} onChange={updateForm} placeholder="KDP 407G" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-900" /></label>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vehicle type<input required name="type" value={form.type} onChange={updateForm} placeholder="Toyota Hiace" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900" /></label>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Driver<input name="driver_name" value={form.driver_name} onChange={updateForm} placeholder="Optional" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900" /></label>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily target<input name="daily_expected_amount" type="number" min="0" value={form.daily_expected_amount} onChange={updateForm} placeholder="8500" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900" /></label>
          </div>
          <button type="submit" className="mt-4 rounded-xl bg-[#12b75b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e9d4e]">Save vehicle</button>
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search registration, driver..." aria-label="Search fleet" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-slate-900" />
        </div>
        <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-900">{filteredVehicles.length}</span> of {vehicles.length} vehicles</p>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <Car className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No vehicles match your search.</p>
          <button type="button" onClick={() => setSearchTerm("")} className="mt-2 text-sm font-semibold text-slate-900 hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredVehicles.map((vehicle) => (
            <article key={vehicle.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <Link to={`/owner/vehicles/${vehicle.id}`} className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white"><img src="/FleetPesa%20FavIcon.jpg" alt="" className="h-full w-full object-cover" /></div>
                  <div className="min-w-0"><h2 className="truncate text-base font-bold text-slate-900">{vehicle.plate_number}</h2><p className="truncate text-sm text-slate-500">{vehicle.type}</p></div>
                </Link>
                <StatusBadge label={vehicle.status} tone={vehicle.status === "active" ? "green" : "amber"} />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600"><UserRound className="h-4 w-4 shrink-0 text-slate-400" /><span className="truncate">{vehicle.driver_name}</span></div>
                <button type="button" onClick={() => removeVehicle(vehicle)} aria-label={`Remove ${vehicle.plate_number}`} title="Remove vehicle" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
