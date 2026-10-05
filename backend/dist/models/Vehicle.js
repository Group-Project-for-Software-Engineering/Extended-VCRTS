"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVehicle = formatVehicle;
exports.validateVehicle = validateVehicle;
// Format a DB row into a plain JS object (NOT a RowDataPacket)
function formatVehicle(row) {
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
function validateVehicle(data) {
    if (!data.vin || !data.make || !data.model) {
        throw new Error("Vehicle is missing required fields");
    }
}
