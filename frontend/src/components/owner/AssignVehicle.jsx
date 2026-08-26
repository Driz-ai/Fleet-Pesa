import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useNotifications } from "../../context/NotificationContext.jsx";

export default function AssignVehicle({
  vehicle,
  drivers = [],
}) {
  const { addNotification } = useNotifications();

  const [driverId, setDriverId] = useState("");
  const [message, setMessage] = useState("");

  function handleAssign(event) {
    event.preventDefault();

    const driver = drivers.find(
      (item) => item.id === driverId,
    );

    if (!driver) {
      return;
    }

    /*
     * Later this should call your backend:
     *
     * await assignVehicle({
     *   vehicleId: vehicle.id,
     *   driverId,
     * });
     */

    addNotification({
      type: "vehicle_assigned",
      title: "Vehicle assigned",
      message: `${vehicle.plate_number} has been assigned to ${driver.name}.`,
      vehicle_id: vehicle.id,
      driver_id: driver.id,
      plate_number: vehicle.plate_number,
    });

    setMessage(
      `${vehicle.plate_number} assigned to ${driver.name}.`,
    );
  }

  return (
    <form
      onSubmit={handleAssign}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Assign driver
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Assign {vehicle.plate_number} to a driver.
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Driver
        </span>

        <select
          value={driverId}
          onChange={(event) =>
            setDriverId(event.target.value)
          }
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#12b75b]"
          required
        >
          <option value="">Choose driver</option>

          {drivers.map((driver) => (
            <option
              key={driver.id}
              value={driver.id}
            >
              {driver.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-[#12b75b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0e9d4e]"
      >
        Assign vehicle
      </button>

      {message && (
        <div className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {message}
        </div>
      )}
    </form>
  );
}