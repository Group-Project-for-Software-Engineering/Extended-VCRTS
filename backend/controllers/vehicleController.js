import { db } from "../config/db.js";

export async function submitVehicle(req, res) {
  const {
    ownerId,
    vin,
    make,
    model,
    plate,
    year,
    arrival,
    departure
  } = req.body;

  try {
    // Insert into pending table for admin approval
    await db.query(
      `INSERT INTO pending_vehicles 
       (ownerId, vin, make, model, plate, year, arrival, departure)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, vin, make, model, plate, year, arrival, departure]
    );

    // Notify admin
    await db.query(
      `INSERT INTO notifications (userId, message)
       VALUES (?, ?)`,
      [1, `New vehicle pending approval from owner ${ownerId}`] // admin = userId 1
    );

    res.json({ message: "Vehicle submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting vehicle" });
  }
}
