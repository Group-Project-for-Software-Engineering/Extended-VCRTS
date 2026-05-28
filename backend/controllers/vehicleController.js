import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";

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
      [4, `New vehicle pending approval from owner ${ownerId}`] // admin = userId 4
    );

    res.json({ message: "Vehicle submitted for approval" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting vehicle" });
  }
}

export async function approveVehicle(req, res) {
  const { vehicleId } = req.body;

  await db.query("UPDATE pending_vehicles SET status='approved' WHERE id=?", [vehicleId]);

  // INSERT INTO vehicles table...
  // (your existing logic)

  // STEP 3 — invalidate cache
  adminCache.users = null;

  res.json({ message: "Vehicle approved" });
}

export async function rejectVehicle(req, res) {
  const { vehicleId } = req.body;

  // Remove from pending table
  await db.query(
    "DELETE FROM pending_vehicles WHERE id=?",
    [vehicleId]
  );

  // Invalidate admin cache
  adminCache.users = null;

  res.json({ message: "Vehicle rejected" });
}
