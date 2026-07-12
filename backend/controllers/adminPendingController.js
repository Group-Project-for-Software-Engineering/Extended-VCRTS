import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";
//------------------------------------------------------------------------------
//API implementation of functions for admin pending page

//get all pending requests from the database
export async function getPendingRequests(req, res) {
  try {
    const [vehicles] = await db.query("SELECT *, 'vehicle' AS type FROM pending_vehicles");
    const [jobs] = await db.query("SELECT *, 'job' AS type FROM pending_jobs");

    const formatted = [
      ...vehicles.map(v => ({
        id: v.id,
        type: "vehicle",
        formatted: `
          <strong>Vehicle Request</strong><br>
          VIN: ${v.vin}<br>
          Make: ${v.make}<br>
          Model: ${v.model}<br>
          Plate: ${v.plate}<br>
          Year: ${v.year}
        `
      })),
      ...jobs.map(j => ({
        id: j.id,
        type: "job",
        formatted: `
          <strong>Job Request</strong><br>
          Description: ${j.description}<br>
          Duration: ${j.duration} hrs<br>
          Deadline: ${j.deadline}
        `
      }))
    ];

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading pending requests" });
  }
}
//-----------------------------------------------------

//Approve a pending job of vehicle
//Update database as needed
export async function approvePending(req, res) {
  const { id, type } = req.body;

  try {
    if (type === "vehicle") {
      // Move from pending_vehicles → vehicles
      const [[v]] = await db.query("SELECT * FROM pending_vehicles WHERE id=?", [id]);

      await db.query(
        `INSERT INTO vehicles (ownerId, vin, make, model, plate, year, arrival, departure)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.ownerId, v.vin, v.make, v.model, v.plate, v.year, v.arrival, v.departure]
      );

      await db.query("DELETE FROM pending_vehicles WHERE id=?", [id]);
    }

    if (type === "job") {
      const [[j]] = await db.query("SELECT * FROM pending_jobs WHERE id=?", [id]);

      await db.query(
        `INSERT INTO jobs (clientId, description, duration, deadline, status)
        VALUES (?, ?, ?, ?, 'pending')`,
        [j.clientId, j.description, j.duration, j.deadline]
      );

      await db.query("DELETE FROM pending_jobs WHERE id=?", [id]);
    }

    // Invalidate admin cache
    adminCache.users = null;

    res.json({ message: "Approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving request" });
  }
}
//---------------------------------------------------------------

//Reject pending job or vehicle. 
//Update database as needed
export async function rejectPending(req, res) {
  const { id, type } = req.body;

  try {
    if (type === "vehicle") {
      await db.query("DELETE FROM pending_vehicles WHERE id=?", [id]);
    }

    if (type === "job") {
      await db.query("DELETE FROM pending_jobs WHERE id=?", [id]);
    }

    // Invalidate admin cache
    adminCache.users = null;

    res.json({ message: "Rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting request" });
  }
}
