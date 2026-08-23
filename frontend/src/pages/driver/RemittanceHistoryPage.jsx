import { useMemo, useState } from "react";
import { ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_REMITTANCES } from "../../data/mockRemittances.js";

function currency(value) {
  return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function DriverRemittanceHistoryPage() {
  const [status, setStatus] = useState("all");
  const remittances = useMemo(
    () => MOCK_REMITTANCES.filter((item) => item.vehicle_id === "mock-1" && (status === "all" || item.status === status)),
    [status],
  );

  return (
    <main className="driver-history-page">
      <header className="driver-history-header">
        <Link to="/driver/remittance" className="driver-history-back"><ArrowLeft size={16} /> Back to remittance</Link>
        <p className="driver-label">My records</p>
        <h1>Remittance History</h1>
        <p>KDJ 421A · Toyota Hiace</p>
      </header>

      <section className="driver-history-content">
        <div className="driver-history-toolbar">
          <div><h2>My remittances</h2><p>Review your recent payment records.</p></div>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All</option><option value="paid">Paid</option><option value="short">Short</option></select></label>
        </div>

        {remittances.length === 0 ? (
          <div className="driver-history-empty"><History size={30} /><strong>No remittances recorded yet.</strong></div>
        ) : (
          <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Date submitted</th><th>Expected</th><th>Actual</th><th>Status</th><th>Payment</th></tr></thead><tbody>{remittances.map((item) => <tr key={item.id}><td className="history-date">{dateLabel(item.submitted_at)}</td><td>{currency(item.expected_amount)}</td><td>{currency(item.actual_amount)}</td><td><span className={`history-status ${item.status === "paid" ? "paid" : "short"}`}>{item.status}</span></td><td><span className="history-payment">{item.payment_status}</span></td></tr>)}</tbody></table></div>
        )}
      </section>
    </main>
  );
}
