//import "../styles/VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <p><strong>Owner Vehicle ID:</strong> {vehicle.vehicleOwnerId}</p>
      <p><strong>VIN:</strong> {vehicle.number}</p>
      <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
      <p><strong>Model:</strong> {vehicle.model}</p>
      <p><strong>Make:</strong> {vehicle.make}</p>
      <p><strong>Year:</strong> {vehicle.year}</p>
      <p><strong>Approximate Residency:</strong> {vehicle.approxTime}</p>
      <p><strong>Day Registered:</strong> {vehicle.dayRegistered}</p>
    </div>
  );
}
