import { Section } from "lucide-react";

export default function DriversPage(){

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
    </div>
  );
}