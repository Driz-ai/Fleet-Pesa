import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DriverPaymentNotifications from "../../components/notifications/DriverPaymentNotifications.jsx";

export default function DriverNotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">

      

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-5">

          <button
            type="button"
            onClick={() => navigate("/driver/remittance")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            aria-label="Back to driver dashboard"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A] text-white">
              <Bell size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A]">
                Driver
              </p>

              <h1 className="text-xl font-bold text-[#0F2440]">
                Notifications
              </h1>
            </div>

          </div>

        </div>
      </header>


      

      <main className="mx-auto max-w-3xl px-5 py-6">

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <DriverPaymentNotifications />

        </div>

      </main>

    </div>
  );
}