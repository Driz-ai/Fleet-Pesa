import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, History, Loader2 } from "lucide-react";
import useRemittanceHistory from "../hooks/useRemittanceHistory.js";
import { MOCK_VEHICLES } from "../data/mockVehicles.js";

function currency(value) { return `KES ${Number(value || 0).toLocaleString("en-KE")}`; }
function dateLabel(value) { return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export default function RemittanceHistoryPage() {
  const { vehicleId } = useParams();
  const [filters, setFilters] = useState({ from: "", to: "", status: "all" });
  const history = useRemittanceHistory(vehicleId, filters);
  const mockVehicle = MOCK_VEHICLES.find((vehicle) => vehicle.id === vehicleId);
  const vehicle = history.vehicle || (mockVehicle && { plate_number: mockVehicle.plate_number, vehicle_type: mockVehicle.type });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-10 sm:p-6">
      <Link to="/owner/fleet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to fleet</Link>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Remittance history</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{vehicle?.plate_number || "Vehicle remittances"}</h1>
        {vehicle?.vehicle_type && <p className="mt-1 text-sm text-slate-500">{vehicle.vehicle_type}</p>}
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end" aria-label="Remittance filters">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">From<input type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">To<input type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} className="mt-1 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Status<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="mt-1 block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option value="all">All</option><option value="paid">Paid</option><option value="short">Short</option></select></label>
      </section>

      {history.loading ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading remittances...</div> : history.error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">{history.error}</p> : history.remittances.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center"><History className="mx-auto text-slate-400" size={30} /><p className="mt-3 text-sm font-semibold text-slate-700">No remittances recorded yet for this vehicle</p></div> : <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Date submitted</th><th className="px-4 py-3">Expected</th><th className="px-4 py-3">Actual</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th></tr></thead><tbody className="divide-y divide-slate-100">{history.remittances.map((item) => <tr key={item.id}><td className="px-4 py-4 text-slate-600">{dateLabel(item.submitted_at)}</td><td className="px-4 py-4 font-semibold text-slate-900">{currency(item.expected_amount)}</td><td className="px-4 py-4 font-semibold text-slate-900">{currency(item.actual_amount)}</td><td className="px-4 py-4"><span className={item.status === "paid" ? "font-semibold text-emerald-700" : "font-semibold text-red-600"}>{item.status}</span></td><td className="px-4 py-4 text-slate-600">{item.payment_status}</td></tr>)}</tbody></table></div>}
    </div>
  );
}