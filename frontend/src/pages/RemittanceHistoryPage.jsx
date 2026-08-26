import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, History, Loader2 } from "lucide-react";
import useRemittanceHistory from "../hooks/useRemittanceHistory.js";
import { MOCK_VEHICLES } from "../data/mockVehicles.js";

function currency(value) { return `KES ${Number(value || 0).toLocaleString("en-KE")}`; }
function dateLabel(value) { return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export default function RemittanceHistoryPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleId || "");
  const [filters, setFilters] = useState({ from: "", to: "", status: "all" });
  const history = useRemittanceHistory(vehicleId, filters);
  const mockVehicle = MOCK_VEHICLES.find((vehicle) => vehicle.id === selectedVehicleId);
  const vehicle = (mockVehicle && { plate_number: mockVehicle.plate_number, vehicle_type: mockVehicle.type }) || history.vehicle;

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearDates = () => {
    setFilters((current) => ({ ...current, from: "", to: "" }));
  };

  useEffect(() => {
    setSelectedVehicleId(vehicleId || "");
  }, [vehicleId]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-10 sm:p-6">
      <Link to="/owner/fleet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to fleet</Link>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Remittance history</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{vehicle?.plate_number || "Vehicle remittances"}</h1>
        {vehicle?.vehicle_type && <p className="mt-1 text-sm text-slate-500">{vehicle.vehicle_type}</p>}
      </header>

      <section className="history-filter-bar" aria-label="Remittance filters">
        <label className="history-date-field">From<input className={!filters.from ? "date-input-empty" : ""} type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} aria-label="Start date" />{!filters.from && <span><CalendarDays size={14} /> PICK A START DATE</span>}</label>
        <label className="history-date-field">To<input className={!filters.to ? "date-input-empty" : ""} type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} aria-label="End date" />{!filters.to && <span><CalendarDays size={14} /> PICK AN END DATE</span>}</label>
        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Status<select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option value="all">All</option><option value="paid">Paid</option><option value="short">Short</option></select></label>
        {(filters.from || filters.to) && <button type="button" className="history-clear-dates" onClick={clearDates}>Clear dates</button>}
        <label className="history-vehicle-picker">Vehicle<select value={selectedVehicleId} onChange={(event) => { setSelectedVehicleId(event.target.value); navigate(`/vehicles/${event.target.value}/remittances`); }}><option value="">Choose a vehicle</option>{MOCK_VEHICLES.map((item) => <option key={item.id} value={item.id}>{item.plate_number} · {item.driver_name}</option>)}</select></label>
      </section>

      {history.loading ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading remittances...</div> : history.error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">{history.error}</p> : history.remittances.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center"><History className="mx-auto text-slate-400" size={30} /><p className="mt-3 text-sm font-semibold text-slate-700">No remittances recorded yet for this vehicle</p></div> : <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Date submitted</th><th>Expected</th><th>Actual</th><th>Status</th><th>Payment</th></tr></thead><tbody>{history.remittances.map((item) => <tr key={item.id}><td className="history-date">{dateLabel(item.submitted_at)}</td><td>{currency(item.expected_amount)}</td><td>{currency(item.actual_amount)}</td><td><span className={`history-status ${item.status === "paid" ? "paid" : "short"}`}>{item.status}</span></td><td><span className="history-payment">{item.payment_status}</span></td></tr>)}</tbody></table></div>}
    </div>
  );
}