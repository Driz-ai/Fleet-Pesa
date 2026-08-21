import { useState } from "react";
import * as api from "../../lib/api.js";
import Avatar from "../../components/shared/Avatar.jsx";
import StatusBadge from "../../components/shared/StatusBadge.jsx";
import UrgencyBadge from "../../components/shared/UrgencyBadge.jsx";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Not available";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function ShortfallModal({ remittance, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  if (!remittance) return null;

  const expectedAmount = Number(remittance.expected_amount || 0);
  const actualAmount = Number(remittance.actual_amount || 0);
  const shortfall = Math.max(expectedAmount - actualAmount, 0);

  const handleFlagFollowUp = async () => {
    if (!remittance?.id) {
      setStatus({ type: "error", message: "This shortfall record is missing an id, so it cannot be flagged." });
      return;
    }

    if (typeof api.updateRemittance !== "function") {
      setStatus({
        type: "error",
        message: "updateRemittance() is missing from lib/api.js. Please add the shared API method before using this action.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      await api.updateRemittance(remittance.id, { flagged_for_followup: true });
      setStatus({
        type: "success",
        message: "This shortfall has been flagged for follow-up.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Unable to flag this shortfall. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={remittance.driver_name || "Driver"} size="md" className="bg-slate-800 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Driver Shortfall
              </p>
              <h2 className="truncate text-lg font-bold text-slate-900">{remittance.driver_name || "Driver"}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Pending review" tone="amber" />
            <UrgencyBadge label="Critical" tone="critical" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Expected
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(expectedAmount)}</p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600">
                  Actual
                </p>
                <p className="mt-2 text-2xl font-bold text-red-700">{formatCurrency(actualAmount)}</p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
              Shortfall: {formatCurrency(shortfall)}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Vehicle
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {remittance.vehicle || "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Timestamp
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formatTimestamp(remittance.timestamp)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Reference
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {remittance.id || "Remittance record"}
            </p>
          </div>

          <div className="pt-1">
            {status.type !== "idle" && (
              <p
                className={`mb-3 text-sm ${
                  status.type === "success" ? "text-emerald-600" : "text-red-600"
                }`}
                role={status.type === "error" ? "alert" : "status"}
              >
                {status.message}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFlagFollowUp}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Flagging..." : "Flag for Follow-up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
