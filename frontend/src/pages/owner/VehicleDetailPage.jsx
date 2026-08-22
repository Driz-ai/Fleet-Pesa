import { useParams } from "react-router-dom";

export default function VehicleDetailPage() {
  const { id } = useParams();

  return <div>Vehicle {id}</div>;
}