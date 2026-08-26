import {
  Bell,
  CheckCheck,
  Trash2,
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext.jsx";

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getIcon(type) {
  switch (type) {
    case "customer_payment":
      return "💰";

    case "remittance_sent":
      return "📤";

    case "remittance_received":
      return "💵";

    case "vehicle_assigned":
      return "🚌";

    default:
      return "🔔";
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "customer_payment":
      return "Customer payment";

    case "remittance_sent":
      return "Daily remittance";

    case "remittance_received":
      return "Remittance received";

    case "vehicle_assigned":
      return "Vehicle assignment";

    default:
      return "Notification";
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearNotifications,
  } = useNotifications();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#12b75b]">
            FleetPesa
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of customer payments, remittances, and vehicle assignments.
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearNotifications}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-base font-bold text-slate-700">
              No notifications yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Payment and vehicle activity will appear here.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`flex w-full gap-4 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                  !notification.read
                    ? "bg-emerald-50/30"
                    : "bg-white"
                }`}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg">
                  {getIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className={`text-sm ${
                        notification.read
                          ? "font-semibold text-slate-700"
                          : "font-bold text-slate-900"
                      }`}
                    >
                      {notification.title}
                    </h2>

                    {!notification.read && (
                      <span className="rounded-full bg-[#12b75b] px-2 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {notification.message}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>
                      {getTypeLabel(notification.type)}
                    </span>

                    <span>
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  {notification.amount && (
                    <p className="mt-2 text-sm font-bold text-[#12b75b]">
                      KES{" "}
                      {Number(
                        notification.amount,
                      ).toLocaleString("en-KE")}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}