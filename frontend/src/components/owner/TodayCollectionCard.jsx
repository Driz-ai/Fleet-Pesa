import { Wallet } from "lucide-react";

import { MOCK_OWNER_COLLECTIONS } from "../../data/mockOwnerCollections.js";

export default function TodayCollectionCard() {
  const total = MOCK_OWNER_COLLECTIONS.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  return (
    <section className="rounded-2xl bg-[#0F2440] p-5 text-white shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Today's collection
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KES {total.toLocaleString("en-KE")}
          </h2>

          <p className="mt-1 text-sm text-slate-300">
            Money received from drivers today
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-full bg-white/10">
          <Wallet size={21} />
        </div>

      </div>

      <div className="mt-5 border-t border-white/10 pt-4">

        <div className="space-y-3">

          {MOCK_OWNER_COLLECTIONS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {item.driver_name}
                </p>

                <p className="text-xs text-slate-400">
                  {item.vehicle_registration} · {item.time}
                </p>
              </div>

              <p className="font-bold text-emerald-300">
                KES {item.amount.toLocaleString("en-KE")}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}