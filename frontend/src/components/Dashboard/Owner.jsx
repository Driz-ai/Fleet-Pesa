// import { useState } from "react";
// import {
//   BusFront,
//   Clock3,
//   TrendingUp,
//   Users,
// } from "lucide-react";
// import {
//   CartesianGrid,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// import ShortfallModal from "../../features/shortfall/ShortfallModal.jsx";

// /*
// |--------------------------------------------------------------------------
// | WEEKLY REVENUE
// |--------------------------------------------------------------------------
// */

// const weeklyRevenue = [
//   { day: "Mon", revenue: 38000 },
//   { day: "Tue", revenue: 45000 },
//   { day: "Wed", revenue: 42000 },
//   { day: "Thu", revenue: 39000 },
//   { day: "Fri", revenue: 52000 },
//   { day: "Sat", revenue: 62000 },
//   { day: "Sun", revenue: 48100 },
// ];

// /*
// |--------------------------------------------------------------------------
// | SAMPLE SHORTFALL
// |--------------------------------------------------------------------------
// */

// const sampleShortfall = {
//   id: "rem-1042",
//   driver_name: "Peter Omondi",
//   vehicle: "KDJ 421A",
//   expected_amount: 24000,
//   actual_amount: 14600,
//   timestamp: "2026-08-21T08:40:00Z",
// };

// /*
// |--------------------------------------------------------------------------
// | HELPERS
// |--------------------------------------------------------------------------
// */

// function formatCurrency(value) {
//   return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
// }

// function RevenueTooltip({ active, payload, label }) {
//   if (!active || !payload?.length) {
//     return null;
//   }

//   return (
//     <div className="chart-tooltip">
//       <strong>{label}</strong>

//       <span>
//         {formatCurrency(payload[0].value)}
//       </span>
//     </div>
//   );
// }

// /*
// |--------------------------------------------------------------------------
// | SUMMARY CARDS
// |--------------------------------------------------------------------------
// */

// const summaryCards = [
//   {
//     label: "Today's Revenue",
//     value: "KES 14,100",
//     trend: "+ 14% vs yesterday",
//     tone: "success",
//     icon: TrendingUp,
//   },
//   {
//     label: "Outstanding",
//     value: "KES 9,900",
//     trend: "4 drivers pending",
//     tone: "warning",
//     icon: Clock3,
//   },
//   {
//     label: "Active Drivers",
//     value: "6 / 8",
//     trend: "1 offline today",
//     tone: "info",
//     icon: Users,
//   },
//   {
//     label: "Vehicles Tracked",
//     value: "8 / 10",
//     trend: "2 parked today",
//     tone: "fleet",
//     icon: BusFront,
//   },
// ];

// /*
// |--------------------------------------------------------------------------
// | OWNER DASHBOARD
// |--------------------------------------------------------------------------
// |
// | This dashboard does NOT render remittance notifications.
// |
// | Remittance notifications belong inside NotificationBell.jsx.
// |
// | Full remittance history:
// | /owner/remittance-transactions
// |
// |--------------------------------------------------------------------------
// */

// export function Owner() {
//   const [showShortfall, setShowShortfall] = useState(true);
//   const [isResolved, setIsResolved] = useState(false);

//   const hasShortfall = !isResolved;

//   return (
//     <div className="owner-dashboard">

//       {/* ==========================================================
//           SUMMARY CARDS
//       ========================================================== */}

//       <section
//         className="summary-grid"
//         aria-label="Owner summary metrics"
//       >
//         {summaryCards.map(
//           ({
//             label,
//             value,
//             trend,
//             tone,
//             icon: Icon,
//           }) => (
//             <div
//               key={label}
//               className={`summary-card ${tone}`}
//             >
//               <div className="summary-icon-wrap">
//                 <Icon
//                   size={18}
//                   strokeWidth={2}
//                 />
//               </div>

//               <div className="summary-metric">
//                 <div className="summary-trend">
//                   {label}
//                 </div>

//                 <div className="summary-value">
//                   {value}
//                 </div>

//                 <div className="summary-label">
//                   {trend}
//                 </div>
//               </div>
//             </div>
//           )
//         )}
//       </section>

//       {/* ==========================================================
//           SHORTFALL ALERT
//       ========================================================== */}

//       {hasShortfall && (
//         <section
//           className={`${
//             isResolved
//               ? "border-emerald-200 bg-emerald-50"
//               : "border-amber-200 bg-amber-50"
//           } shortfall-alert mt-6 mb-6 rounded-2xl p-4 shadow-sm`}
//         >
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//             <div>
//               <p
//                 className={`shortfall-alert-label text-xs font-semibold uppercase tracking-[0.12em] ${
//                   isResolved
//                     ? "text-emerald-700"
//                     : "text-amber-700"
//                 }`}
//               >
//                 {isResolved
//                   ? "Resolved shortfall"
//                   : "Shortfall alert"}
//               </p>

//               <h3 className="shortfall-alert-title mt-1 text-lg font-bold text-slate-900">
//                 {isResolved
//                   ? "Peter Omondi remittance has been resolved"
//                   : "Peter Omondi has a remittance gap"}
//               </h3>
//             </div>

//             <button
//               type="button"
//               onClick={() => setShowShortfall(true)}
//               className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
//             >
//               {isResolved
//                 ? "View resolved record"
//                 : "View details"}
//             </button>

//           </div>
//         </section>
//       )}

//       {/* ==========================================================
//           WEEKLY REVENUE
//       ========================================================== */}

//       <section
//         className="revenue-card"
//         aria-labelledby="weekly-revenue-title"
//       >
//         <div className="card-heading">

//           <div>
//             <h2 id="weekly-revenue-title">
//               Weekly Revenue
//             </h2>

//             <p>
//               Last 7 days · daily target KES 42,000
//             </p>
//           </div>

//           <div
//             className="chart-legend"
//             aria-label="Chart legend"
//           >
//             <span>
//               <i className="legend-dot revenue-dot" />
//               Revenue
//             </span>

//             <span>
//               <i className="legend-dot target-dot" />
//               Target
//             </span>
//           </div>

//         </div>

//         <div className="revenue-chart">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <LineChart
//               data={weeklyRevenue}
//               margin={{
//                 top: 10,
//                 right: 8,
//                 left: 4,
//                 bottom: 4,
//               }}
//             >
//               <CartesianGrid
//                 stroke="#e8eef4"
//                 strokeDasharray="3 4"
//                 vertical={false}
//               />

//               <XAxis
//                 dataKey="day"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{
//                   fill: "#9aacc2",
//                   fontSize: 12,
//                 }}
//               />

//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{
//                   fill: "#9aacc2",
//                   fontSize: 12,
//                 }}
//                 tickFormatter={(value) =>
//                   `${value / 1000}k`
//                 }
//                 width={36}
//                 domain={[0, 80000]}
//               />

//               <Tooltip
//                 content={<RevenueTooltip />}
//                 cursor={{
//                   stroke: "#cbd8e5",
//                   strokeDasharray: "4 4",
//                 }}
//               />

//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#203f68"
//                 strokeWidth={2.5}
//                 dot={false}
//                 activeDot={{
//                   r: 5,
//                   fill: "#0ca653",
//                   strokeWidth: 0,
//                 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       {/* ==========================================================
//           SHORTFALL MODAL
//       ========================================================== */}

//       {showShortfall && (
//         <ShortfallModal
//           remittance={sampleShortfall}
//           onClose={() => setShowShortfall(false)}
//           onResolved={() => setIsResolved(true)}
//         />
//       )}

//     </div>
//   );
// }

// export default Owner;




import { useEffect, useMemo, useState } from "react";
import {
  BusFront,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ShortfallModal from "../../features/shortfall/ShortfallModal.jsx";
import api from "../../lib/api.js";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
  return `KES ${Number(value || 0).toLocaleString("en-KE")}`;
}

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>

      <span>
        {formatCurrency(payload[0].value)}
      </span>
    </div>
  );
}

function getApiErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.msg ||
    error?.message ||
    fallback
  );
}

/*
|--------------------------------------------------------------------------
| NORMALIZE BACKEND RESPONSES
|--------------------------------------------------------------------------
|
| These helpers allow the frontend to work with common Flask response
| shapes without pretending that a specific response shape exists.
|
|--------------------------------------------------------------------------
*/

function normalizeList(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.items)) {
    return responseData.items;
  }

  if (Array.isArray(responseData?.remittances)) {
    return responseData.remittances;
  }

  if (Array.isArray(responseData?.vehicles)) {
    return responseData.vehicles;
  }

  if (Array.isArray(responseData?.assignments)) {
    return responseData.assignments;
  }

  return [];
}

/*
|--------------------------------------------------------------------------
| OWNER DASHBOARD
|--------------------------------------------------------------------------
*/

export function Owner() {
  const [remittances, setRemittances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [driverAssignments, setDriverAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showShortfall, setShowShortfall] = useState(false);
  const [selectedShortfall, setSelectedShortfall] = useState(null);
  const [isResolved, setIsResolved] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD OWNER DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [
          remittancesResponse,
          vehiclesResponse,
          assignmentsResponse,
        ] = await Promise.all([
          api.get("/remittances"),
          api.get("/vehicles"),
          api.get("/driver-assignments"),
        ]);

        if (!mounted) {
          return;
        }

        setRemittances(
          normalizeList(remittancesResponse.data)
        );

        setVehicles(
          normalizeList(vehiclesResponse.data)
        );

        setDriverAssignments(
          normalizeList(assignmentsResponse.data)
        );
      } catch (err) {
        console.error(
          "Failed to load owner dashboard:",
          err
        );

        if (mounted) {
          setError(
            getApiErrorMessage(
              err,
              "Unable to load dashboard data."
            )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TODAY
  |--------------------------------------------------------------------------
  */

  const today = useMemo(() => {
    return new Date().toISOString().slice(0, 10);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TODAY'S REMITTANCES
  |--------------------------------------------------------------------------
  */

  const todaysRemittances = useMemo(() => {
    return remittances.filter((remittance) => {
      const timestamp =
        remittance?.timestamp ||
        remittance?.created_at ||
        remittance?.date;

      if (!timestamp) {
        return false;
      }

      return String(timestamp).slice(0, 10) === today;
    });
  }, [remittances, today]);

  /*
  |--------------------------------------------------------------------------
  | TOTAL TODAY'S REVENUE
  |--------------------------------------------------------------------------
  */

  const todaysRevenue = useMemo(() => {
    return todaysRemittances.reduce(
      (total, remittance) => {
        const amount =
          remittance?.actual_amount ??
          remittance?.amount ??
          remittance?.paid_amount ??
          remittance?.remitted_amount ??
          0;

        return total + Number(amount || 0);
      },
      0
    );
  }, [todaysRemittances]);

  /*
  |--------------------------------------------------------------------------
  | OUTSTANDING
  |--------------------------------------------------------------------------
  */

  const outstanding = useMemo(() => {
    return remittances.reduce(
      (total, remittance) => {
        const expected =
          Number(
            remittance?.expected_amount || 0
          );

        const actual =
          Number(
            remittance?.actual_amount ??
              remittance?.amount ??
              remittance?.paid_amount ??
              0
          );

        const difference = expected - actual;

        return total + Math.max(difference, 0);
      },
      0
    );
  }, [remittances]);

  /*
  |--------------------------------------------------------------------------
  | ACTIVE DRIVERS
  |--------------------------------------------------------------------------
  */

  const activeDrivers = useMemo(() => {
    const uniqueDrivers = new Set();

    driverAssignments.forEach((assignment) => {
      const status = String(
        assignment?.status || ""
      ).toLowerCase();

      const driverId =
        assignment?.driver_id ||
        assignment?.driver?.id ||
        assignment?.user_id;

      const driverName =
        assignment?.driver_name ||
        assignment?.driver?.name;

      if (
        status === "active" ||
        status === "assigned"
      ) {
        if (driverId) {
          uniqueDrivers.add(
            `id:${driverId}`
          );
        } else if (driverName) {
          uniqueDrivers.add(
            `name:${driverName}`
          );
        }
      }
    });

    return uniqueDrivers.size;
  }, [driverAssignments]);

  /*
  |--------------------------------------------------------------------------
  | VEHICLES
  |--------------------------------------------------------------------------
  */

  const activeVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const status = String(
        vehicle?.status || ""
      ).toLowerCase();

      return (
        status === "active" ||
        status === "on_trip" ||
        status === "assigned"
      );
    }).length;
  }, [vehicles]);

  const parkedVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const status = String(
        vehicle?.status || ""
      ).toLowerCase();

      return status === "parked";
    }).length;
  }, [vehicles]);

  /*
  |--------------------------------------------------------------------------
  | SHORTFALLS
  |--------------------------------------------------------------------------
  */

  const shortfalls = useMemo(() => {
    return remittances
      .map((remittance) => {
        const expected =
          Number(
            remittance?.expected_amount || 0
          );

        const actual =
          Number(
            remittance?.actual_amount ??
              remittance?.amount ??
              remittance?.paid_amount ??
              0
          );

        const difference =
          expected - actual;

        if (difference <= 0) {
          return null;
        }

        return {
          ...remittance,

          id:
            remittance?.id ||
            remittance?.remittance_id,

          driver_name:
            remittance?.driver_name ||
            remittance?.driver?.name ||
            "Unknown driver",

          vehicle:
            remittance?.vehicle ||
            remittance?.plate_number ||
            remittance?.vehicle_plate ||
            "Unknown vehicle",

          expected_amount: expected,

          actual_amount: actual,

          timestamp:
            remittance?.timestamp ||
            remittance?.created_at ||
            remittance?.date,
        };
      })
      .filter(Boolean);
  }, [remittances]);

  const currentShortfall =
    shortfalls[0] || null;

  const hasShortfall =
    Boolean(currentShortfall) &&
    !isResolved;

  /*
  |--------------------------------------------------------------------------
  | WEEKLY REVENUE
  |--------------------------------------------------------------------------
  |
  | Calculated from the remittances returned by the backend.
  |
  |--------------------------------------------------------------------------
  */

  const weeklyRevenue = useMemo(() => {
    const days = [];

    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date();

      date.setDate(
        date.getDate() - index
      );

      const dateKey =
        date.toISOString().slice(0, 10);

      const dayLabel =
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        );

      const revenue =
        remittances
          .filter((remittance) => {
            const timestamp =
              remittance?.timestamp ||
              remittance?.created_at ||
              remittance?.date;

            return (
              timestamp &&
              String(timestamp).slice(
                0,
                10
              ) === dateKey
            );
          })
          .reduce(
            (total, remittance) => {
              const amount =
                remittance?.actual_amount ??
                remittance?.amount ??
                remittance?.paid_amount ??
                remittance?.remitted_amount ??
                0;

              return (
                total +
                Number(amount || 0)
              );
            },
            0
          );

      days.push({
        day: dayLabel,
        revenue,
      });
    }

    return days;
  }, [remittances]);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY CARDS
  |--------------------------------------------------------------------------
  */

  const summaryCards = [
    {
      label: "Today's Revenue",
      value: formatCurrency(
        todaysRevenue
      ),
      trend: "From today's remittances",
      tone: "success",
      icon: TrendingUp,
    },
    {
      label: "Outstanding",
      value: formatCurrency(
        outstanding
      ),
      trend:
        shortfalls.length > 0
          ? `${shortfalls.length} driver${
              shortfalls.length === 1
                ? ""
                : "s"
            } with a gap`
          : "No outstanding shortfalls",
      tone: "warning",
      icon: Clock3,
    },
    {
      label: "Active Drivers",
      value: String(activeDrivers),
      trend: `${driverAssignments.length} assignments`,
      tone: "info",
      icon: Users,
    },
    {
      label: "Vehicles Tracked",
      value: String(
        activeVehicles
      ),
      trend:
        `${vehicles.length} total · ` +
        `${parkedVehicles} parked`,
      tone: "fleet",
      icon: BusFront,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | OPEN SHORTFALL
  |--------------------------------------------------------------------------
  */

  function handleViewShortfall() {
    if (!currentShortfall) {
      return;
    }

    setSelectedShortfall(
      currentShortfall
    );

    setShowShortfall(true);
  }

  /*
  |--------------------------------------------------------------------------
  | RESOLVE SHORTFALL
  |--------------------------------------------------------------------------
  */

  function handleResolved() {
    setIsResolved(true);
    setShowShortfall(false);
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-sm font-semibold text-slate-500">
            Loading owner dashboard...
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="owner-dashboard">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            Unable to load dashboard
          </p>

          <p className="mt-1 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="owner-dashboard">

      {/* ==========================================================
          SUMMARY CARDS
      ========================================================== */}

      <section
        className="summary-grid"
        aria-label="Owner summary metrics"
      >
        {summaryCards.map(
          ({
            label,
            value,
            trend,
            tone,
            icon: Icon,
          }) => (
            <div
              key={label}
              className={`summary-card ${tone}`}
            >
              <div className="summary-icon-wrap">
                <Icon
                  size={18}
                  strokeWidth={2}
                />
              </div>

              <div className="summary-metric">
                <div className="summary-trend">
                  {label}
                </div>

                <div className="summary-value">
                  {value}
                </div>

                <div className="summary-label">
                  {trend}
                </div>
              </div>
            </div>
          )
        )}
      </section>

      {/* ==========================================================
          SHORTFALL ALERT
      ========================================================== */}

      {hasShortfall && (
        <section
          className="shortfall-alert mt-6 mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="shortfall-alert-label text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                Shortfall alert
              </p>

              <h3 className="shortfall-alert-title mt-1 text-lg font-bold text-slate-900">
                {currentShortfall.driver_name}{" "}
                has a remittance gap
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Expected{" "}
                {formatCurrency(
                  currentShortfall.expected_amount
                )}{" "}
                · Actual{" "}
                {formatCurrency(
                  currentShortfall.actual_amount
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleViewShortfall
              }
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View details
            </button>

          </div>
        </section>
      )}

      {/* ==========================================================
          NO SHORTFALL
      ========================================================== */}

      {!hasShortfall &&
        shortfalls.length === 0 && (
          <section className="shortfall-alert mt-6 mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Fleet status
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              No remittance shortfalls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              All available remittance records
              are currently accounted for.
            </p>
          </section>
        )}

      {/* ==========================================================
          WEEKLY REVENUE
      ========================================================== */}

      <section
        className="revenue-card"
        aria-labelledby="weekly-revenue-title"
      >
        <div className="card-heading">

          <div>
            <h2 id="weekly-revenue-title">
              Weekly Revenue
            </h2>

            <p>
              Last 7 days · daily target
              KES 42,000
            </p>
          </div>

          <div
            className="chart-legend"
            aria-label="Chart legend"
          >
            <span>
              <i className="legend-dot revenue-dot" />
              Revenue
            </span>

            <span>
              <i className="legend-dot target-dot" />
              Target
            </span>
          </div>

        </div>

        <div className="revenue-chart">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={weeklyRevenue}
              margin={{
                top: 10,
                right: 8,
                left: 4,
                bottom: 4,
              }}
            >
              <CartesianGrid
                stroke="#e8eef4"
                strokeDasharray="3 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9aacc2",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9aacc2",
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `${value / 1000}k`
                }
                width={36}
                domain={[0, 80000]}
              />

              <Tooltip
                content={
                  <RevenueTooltip />
                }
                cursor={{
                  stroke: "#cbd8e5",
                  strokeDasharray: "4 4",
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#203f68"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#0ca653",
                  strokeWidth: 0,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ==========================================================
          SHORTFALL MODAL
      ========================================================== */}

      {showShortfall &&
        selectedShortfall && (
          <ShortfallModal
            remittance={
              selectedShortfall
            }
            onClose={() =>
              setShowShortfall(false)
            }
            onResolved={
              handleResolved
            }
          />
        )}

    </div>
  );
}

export default Owner;
