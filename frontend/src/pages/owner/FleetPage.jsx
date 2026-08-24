import { useEffect, useMemo, useState } from "react";
import { BusFront, Pencil, Plus, Search, Trash2, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_VEHICLES } from "../../data/mockVehicles.js";
import Pagination from "../../components/shared/Pagination.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";

const INITIAL_FORM = {
  plate_number: "",
  type: "",
  driver_name: "",
  daily_expected_amount: "",
  daily_due_time: "14:00",
};

const LEGACY_TYPE_MAP = {
  "Nissan Caravan": "Isuzu NQR",
  "Toyota Noah": "Hino 300",
  "Isuzu NPR": "Isuzu NQR",
  "Toyota Probox": "Mitsubishi Fuso Canter",
  "Mitsubishi Canter": "Mitsubishi Fuso Canter",
};

const LEGACY_STATUS_MAP = {
  available: "parked",
};

const REMITTANCE_TONE = {
  paid: "green",
  unpaid: "amber",
  short: "red",
};

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function migrateVehicles(vehicles) {
  if (!Array.isArray(vehicles)) {
    return MOCK_VEHICLES;
  }

  return vehicles.map((vehicle) => {
    const wasLegacyKdm = vehicle.plate_number === "KDM 746D";

    return {
      ...vehicle,
      plate_number: vehicle.plate_number
        ?.replace(/^KDO\b/, "KDR")
        .replace(/^KDM 746D$/, "KDM 745D"),
      type: LEGACY_TYPE_MAP[vehicle.type] || vehicle.type,
      status: wasLegacyKdm
        ? "parked"
        : LEGACY_STATUS_MAP[vehicle.status] || vehicle.status,
      remittance_status: vehicle.remittance_status || "unpaid",
      daily_due_time: vehicle.daily_due_time || "14:00",
    };
  });
}

function getStoredVehicles() {
  try {
    const stored = localStorage.getItem("fleetpesa_mock_vehicles");

    return stored
      ? migrateVehicles(JSON.parse(stored))
      : MOCK_VEHICLES;
  } catch {
    return MOCK_VEHICLES;
  }
}

export default function FleetPage() {
  const [vehicles, setVehicles] = useState(getStoredVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [fleetPage, setFleetPage] = useState(1);

  const fleetPageSize = 4;

  useEffect(() => {
    localStorage.setItem(
      "fleetpesa_mock_vehicles",
      JSON.stringify(vehicles),
    );
  }, [vehicles]);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setCurrentTime(new Date()),
      30000,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  const filteredVehicles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return vehicles;
    }

    return vehicles.filter((vehicle) =>
      [
        vehicle.plate_number,
        vehicle.type,
        vehicle.driver_name,
        vehicle.status,
        vehicle.remittance_status,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query),
      ),
    );
  }, [searchTerm, vehicles]);

  const fleetPageCount = Math.ceil(
    filteredVehicles.length / fleetPageSize,
  );

  const visibleVehicles = filteredVehicles.slice(
    (fleetPage - 1) * fleetPageSize,
    fleetPage * fleetPageSize,
  );

  useEffect(() => {
    setFleetPage((page) =>
      Math.min(page, Math.max(fleetPageCount, 1)),
    );
  }, [fleetPageCount]);

  const ownerAlerts = useMemo(() => {
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    return vehicles.flatMap((vehicle) => {
      const [hours, minutes] = (
        vehicle.daily_due_time || "14:00"
      )
        .split(":")
        .map(Number);

      const dueMinutes = hours * 60 + minutes;
      const alerts = [];

      if (
        vehicle.status === "active" &&
        vehicle.remittance_status === "unpaid" &&
        currentMinutes >= dueMinutes
      ) {
        alerts.push(
          `${vehicle.plate_number} has not remitted by ${vehicle.daily_due_time}.`,
        );
      }

      if (vehicle.remittance_status === "short") {
        alerts.push(
          `${vehicle.plate_number} sent a shortfall remittance. Review the payment.`,
        );
      }

      return alerts;
    });
  }, [currentTime, vehicles]);

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  const addVehicle = (event) => {
    event.preventDefault();

    const plateNumber = form.plate_number.trim().toUpperCase();

    if (!/^KD[A-Z] \d{3}[A-Z]$/.test(plateNumber)) {
      setFormError("Use a registration such as KDR 631F.");
      return;
    }

    if (!form.type.trim()) {
      setFormError("Enter the vehicle type.");
      return;
    }

    if (
      vehicles.some(
        (vehicle) => vehicle.plate_number === plateNumber,
      )
    ) {
      setFormError("That registration is already in your fleet.");
      return;
    }

    const newVehicle = {
      id: `mock-${Date.now()}`,
      plate_number: plateNumber,
      type: form.type.trim(),
      driver_name: form.driver_name.trim() || "Unassigned",
      driver_phone: "",
      status: "parked",
      remittance_status: "unpaid",
      daily_expected_amount:
        Number(form.daily_expected_amount) || 0,
      daily_due_time: form.daily_due_time || "14:00",
    };

    setVehicles((current) => [newVehicle, ...current]);
    setSearchTerm("");
    setFleetPage(1);
    setSaveMessage(`${plateNumber} was added to your fleet.`);
    setFormError("");
    setForm(INITIAL_FORM);
    setIsAddOpen(false);
  };

  const removeVehicle = (vehicle) => {
    if (
      window.confirm(
        `Remove ${vehicle.plate_number} from this fleet?`,
      )
    ) {
      setVehicles((current) =>
        current.filter((item) => item.id !== vehicle.id),
      );

      setSaveMessage(
        `${vehicle.plate_number} was removed from your fleet.`,
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Owner workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            My fleet
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your vehicles and keep every route accounted for.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen((open) => !open)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {isAddOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}

          {isAddOpen ? "Close form" : "Add vehicle"}
        </button>
      </div>

      {saveMessage && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          role="status"
        >
          {saveMessage}
        </p>
      )}

      {ownerAlerts.length > 0 && (
        <section className="space-y-2" aria-label="Owner alerts">
          {ownerAlerts.map((alert) => (
            <p
              key={alert}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
              role="alert"
            >
              {alert}
            </p>
          ))}
        </section>
      )}

      {isAddOpen && (
        <form
          onSubmit={addVehicle}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Add a vehicle
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Use a registration in the format KDJ 123A through KDZ
              999Z.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Registration
              <input
                required
                name="plate_number"
                value={form.plate_number}
                onChange={updateForm}
                placeholder="KDP 407G"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-900"
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vehicle type
              <input
                required
                name="type"
                value={form.type}
                onChange={updateForm}
                placeholder="Toyota Hiace"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Driver
              <input
                name="driver_name"
                value={form.driver_name}
                onChange={updateForm}
                placeholder="Optional"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Daily target
              <input
                name="daily_expected_amount"
                type="number"
                min="0"
                value={form.daily_expected_amount}
                onChange={updateForm}
                placeholder="8500"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>

            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Daily due payment
              <input
                required
                name="daily_due_time"
                type="time"
                value={form.daily_due_time}
                onChange={updateForm}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>
          </div>

          {formError && (
            <p
              className="mt-3 text-sm font-semibold text-red-600"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 rounded-xl bg-[#12b75b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e9d4e]"
          >
            Save vehicle
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setFleetPage(1);
            }}
            placeholder="Search registration, driver..."
            aria-label="Search fleet"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          />
        </div>

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {filteredVehicles.length}
          </span>{" "}
          of {vehicles.length} vehicles
        </p>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <BusFront className="mx-auto h-8 w-8 text-slate-400" />

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No vehicles match your search.
          </p>

          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-2 text-sm font-semibold text-slate-900 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visibleVehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  to={`/vehicles/${vehicle.id}/remittances`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                    <img
                      src="/FleetPesa%20FavIcon.jpg"
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-slate-900">
                      {vehicle.plate_number}
                    </h2>

                    <p className="truncate text-sm text-slate-500">
                      {vehicle.type}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col items-end gap-2">
                  <StatusBadge
                    label={
                      vehicle.status === "active"
                        ? "Active"
                        : "Parked"
                    }
                    tone={
                      vehicle.status === "active"
                        ? "green"
                        : "slate"
                    }
                  />

                  <StatusBadge
                    label={`Remittance ${statusLabel(
                      vehicle.remittance_status || "unpaid",
                    )}`}
                    tone={
                      REMITTANCE_TONE[
                        vehicle.remittance_status
                      ] || "amber"
                    }
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                  <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">
                    {vehicle.driver_name}
                  </span>
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Due {vehicle.daily_due_time || "14:00"}
                </span>

                <button
                  type="button"
                  onClick={() => removeVehicle(vehicle)}
                  aria-label={`Remove ${vehicle.plate_number}`}
                  title="Remove vehicle"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        page={fleetPage}
        pageCount={fleetPageCount}
        onPageChange={setFleetPage}
      />
    </div>
  );
}
