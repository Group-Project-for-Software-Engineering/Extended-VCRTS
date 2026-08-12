import { RowDataPacket } from "mysql2";

// Represents a row returned from MySQL
export interface Vehicle extends RowDataPacket {
  id: number;
  ownerId: number;
  vin: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  arrival: string;
  departure: string;
}

// Represents input when creating a new vehicle
export interface NewVehicleInput {
  ownerId: number;
  vin: string;
  make: string;
  model: string;
  plate: string;
  year: number;
  arrival: string;
  departure: string;
}

// Format a DB row into a plain JS object (NOT a RowDataPacket)
export function formatVehicle(row: any) {
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

// Validate input for vehicle creation
export function validateVehicle(data: NewVehicleInput): void {
  if (!data.vin || !data.make || !data.model) {
    throw new Error("Vehicle is missing required fields");
  }
}
