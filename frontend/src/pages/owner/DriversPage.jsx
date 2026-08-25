import { Section,Search ,Pencil,Power,Trash2} from "lucide-react";
import { useState } from "react";
export default function DriversPage(){
    const initialdrivers = [
  {
    id: 1,
    name: "Peter Omondi",
    phone: "0712345678",
    status: "active",
    vehicle: "KDJ 421A",
  },
  {
    id: 2,
    name: "Brian Kiptoo",
    phone: "0723456789",
    status: "inactive",
    vehicle: "Unassigned",
  },
];
    const [drivers,setDrivers] = useState(initialdrivers)
    const [search,setSearch] = useState("")
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState({name: "",phone: "",});

const filteredDrivers = drivers.filter((driver) =>
  driver.name.toLowerCase().includes(search.toLowerCase())
);

function handleToggleStatus(driverId){
setDrivers((currentDrivers)=> 
currentDrivers.map((driver) => driver.id === driverId ? 
{...driver,status:driver.status === "active" ? "inactive" : "active",} :driver))
}
function handleFormChange(event) {
  const { name, value } = event.target;

  setForm((currentForm) => ({
    ...currentForm,
    [name]: value,
  }));
}
function handleAddDriver(event) {
  event.preventDefault();
  if (!form.name.trim() || !form.phone.trim()) {
    return;
  }
  const newDriver = {
    id: Date.now(),
    name: form.name.trim(),
    phone: form.phone.trim(),
    status: "active",
    vehicle: "Unassigned",
  };
  setDrivers((currentDrivers) => [
    ...currentDrivers,
    newDriver,
  ]);
  setForm({
    name: "",
    phone: "",
  });
  setIsAddOpen(false);
}
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
  onClick={() => setIsAddOpen(true)}
  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
>
   + Add driver
</button>
</div>
{isAddOpen && (
  <form onSubmit={handleAddDriver}
  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Add a driver
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the driver's details below.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsAddOpen(false)}
        className="text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        Close
      </button>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleFormChange}
        placeholder="Driver name"
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleFormChange}
        placeholder="Phone number"
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
      />
      <button
  type="submit"
  className="mt-4 inline-flex w-fit items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
>
  Save driver
</button>
    </div>
  </form>
)}
      <div className="relative max-w-md">
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  />

  <input
    type="search"
    placeholder="Search driver..."
    value={search}
    onChange={(e) =>setSearch(e.target.value)}
    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400"
  />
</div>
<div className="grid gap-4 sm:grid-cols-2">
  {filteredDrivers.map((driver) => (
    <div
      key={driver.id}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {driver.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {driver.phone}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            driver.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {driver.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-sm text-slate-500">
          Vehicle
        </p>

        <p className="font-medium text-slate-900">
          {driver.vehicle}
        </p>
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
  <button
    type="button"
    title="Edit driver"
    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
  >
    <Pencil size={17} />
  </button>
  <button
  type="button"
  onClick={() => handleToggleStatus(driver.id)}
  title={driver.status === "active" ? "Deactivate driver" : "Activate driver"}
  className={`rounded-lg p-2 transition ${
    driver.status === "active"
      ? "text-amber-600 hover:bg-amber-50"
      : "text-emerald-600 hover:bg-emerald-50"
  }`}
>
  <Power size={17} />
</button>
  <button
    type="button"
    title="Delete driver"
    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
  >
    <Trash2 size={17} />
  </button>
</div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}