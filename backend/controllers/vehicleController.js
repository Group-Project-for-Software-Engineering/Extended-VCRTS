import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";
//------------------------------------------------------------------------------
//Implementation of functions for the submit a vehicle page

// Owner submits → goes to pending_vehicles
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
    await db.query(
      `INSERT INTO pending_vehicles 
       (ownerId, vin, make, model, plate, year, arrival, departure)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, vin, make, model, plate, year, arrival, departure]
    );

    // Notify admin (hardcoded adminId = 4)
    await db.query(
      `INSERT INTO notifications (userId, message)
       VALUES (?, ?)`,
      [4, `New vehicle pending approval from owner ${ownerId}`]
    );

    res.json({ message: "Vehicle submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting vehicle" });
  }
}
//-------------------------------------------------------------

// GET VEHICLES FOR OWNER (Home page)
export async function getVehiclesByOwner(req, res) {
  const { ownerId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM vehicles WHERE ownerId=?",
      [ownerId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading vehicles" });
  }
}
