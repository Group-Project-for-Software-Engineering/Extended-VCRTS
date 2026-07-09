import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";

export async function getAllRemovableItems(req, res) {
  try {
    const [vehicles] = await db.query(`
      SELECT id, ownerId AS userId, vin, make, model, plate, year, arrival, departure,
      'vehicle' AS type
      FROM vehicles
    `);

    const [jobs] = await db.query(`
      SELECT id, clientId AS userId, description, duration, deadline,
      'job' AS type
      FROM jobs
    `);

    const formatted = [
      ...vehicles.map(v => ({
        id: v.id,
        type: "vehicle",
        userId: v.userId,
        formatted: `
          <strong>Vehicle</strong><br>
          User ID: ${v.userId}<br>
          Make: ${v.make}<br>
          Model: ${v.model}<br>
          VIN: ${v.vin}<br>
          Plate: ${v.plate}<br>
          Year: ${v.year}<br>
          Arrival: ${v.arrival}<br>
          Departure: ${v.departure}<br>
          Registered: ${v.dayRegistered}
        `
      })),
      ...jobs.map(j => ({
        id: j.id,
        type: "job",
        userId: j.userId,
        formatted: `
    <strong>Job</strong><br>
    User ID: ${j.userId}<br>
    Description: ${j.description}<br>
    Duration: ${j.duration} hrs<br>
    Deadline: ${j.deadline}<br>
    Status: ${j.status}<br>
    Assigned Vehicle: ${j.assignedVehicleId ?? "None"}
  `
      }))
    ];

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading removal items" });
  }
}

export async function removeItem(req, res) {
  const { id, type, userId } = req.body;

  try {
    if (type === "vehicle") {
      await db.query("DELETE FROM vehicles WHERE id=?", [id]);
      await db.query(
        "INSERT INTO notifications (userId, message) VALUES (?, ?)",
        [userId, "One of your vehicles has been removed by an admin."]
      );
    }

    if (type === "job") {
      await db.query("DELETE FROM jobs WHERE id=?", [id]);
      await db.query(
        "INSERT INTO notifications (userId, message) VALUES (?, ?)",
        [userId, "One of your jobs has been removed by an admin."]
      );
    }

    // Invalidate admin cache
    adminCache.users = null;

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing item" });
  }
}
