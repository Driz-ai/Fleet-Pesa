import { Section,Search } from "lucide-react";

export default function DriversPage(){

    const drivers = [
  {
    id: 1,
    name: "Peter Omondi",
    phone: "0712345678",
    status: "active",
    vehicle: "KDJ 421A",
  },
  {
    id: 2,
    name: "Brian Kiptoo",
    phone: "0723456789",
    status: "inactive",
    vehicle: "Unassigned",
  },
];
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-10 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
           Owner workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Drivers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your drivers and vehicle assignments.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          + Add driver
        </button>
      </div>
      <div className="relative max-w-md">
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="search"
    placeholder="Search driver..."
    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
  />
</div>
<div className="grid gap-4 sm:grid-cols-2">
  {drivers.map((driver) => (
    <div
      key={driver.id}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {driver.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {driver.phone}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            driver.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {driver.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-sm text-slate-500">
          Vehicle
        </p>

        <p className="font-medium text-slate-900">
          {driver.vehicle}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}