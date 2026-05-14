export function formatVehicle(row) {
  return {
    id: row.id,
    ownerId: row.ownerId,
    vin: row.vin,
    make: row.make,
    model: row.model,
    plate: row.plate,
    year: row.year,
    arrival: row.arrival,
    departure: row.departure
  };
}

export function validateVehicle(data) {
  if (!data.vin || !data.make || !data.model) {
    throw new Error("Vehicle is missing required fields");
  }
}