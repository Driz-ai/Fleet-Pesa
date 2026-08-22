import { useParams } from "react-router-dom";

export default function VehicleDetailPage() {
  const { id } = useParams();

  return <div>Vehicle {id}</div>;

  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (timestamp) => {
  if (!timestamp) return "Not available";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const STATUS_TONE = {
  paid: "green",
  late: "amber",
  short: "red",
};

function statusLabel(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
}