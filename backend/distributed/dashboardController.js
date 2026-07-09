import { db } from "../config/db.js";
import { formatJob } from "../models/Job.js";

export async function getVehicleStatus(req, res) {
  try {
    const [vehicles] = await db.query(`
      SELECT v.id,
             v.make,
             v.model,
             v.vin,
             h.lastHeartbeat,
             TIMESTAMPDIFF(SECOND, h.lastHeartbeat, NOW()) AS secondsSinceHeartbeat
      FROM vehicles v
      LEFT JOIN vehicle_heartbeats h ON v.id = h.vehicleId
    `);

    const formatted = vehicles.map(v => ({
      id: v.id,
      make: v.make,
      model: v.model,
      vin: v.vin,
      alive: v.secondsSinceHeartbeat !== null && v.secondsSinceHeartbeat < 5,
      lastHeartbeat: v.lastHeartbeat,
      secondsSinceHeartbeat: v.secondsSinceHeartbeat
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading vehicle status" });
  }
}

export async function getAllJobs(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM jobs ORDER BY timestamp DESC");
    res.json(rows.map(formatJob));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading jobs" });
  }
}
