import "../styles/VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <p><strong>Owner Vehicle ID:</strong> {vehicle.id}</p>
      <p><strong>VIN:</strong> {vehicle.vin}</p>
      <p><strong>License Plate:</strong> {vehicle.plate}</p>
      <p><strong>Model:</strong> {vehicle.model}</p>
      <p><strong>Make:</strong> {vehicle.make}</p>
      <p><strong>Year:</strong> {vehicle.year}</p>
      <p><strong>Arrival</strong> {vehicle.arrival}</p>
      <p><strong>Departure</strong> {vehicle.departure}</p>
    </div>
  );
}
