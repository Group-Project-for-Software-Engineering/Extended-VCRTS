import { db } from "../config/db";
import { createNotification } from "./notificationController";
import { adminCache } from "../cache/adminCache";
import { Request, Response } from "express"
import { Vehicle } from "../models/Vehicle";
import { Job } from "../models/Job";
//------------------------------------------------------------------------------
//API implementation of functions for admin pending page

//get all pending requests from the database
export async function getPendingRequests(res: Response) {
  try {
    const [vehicles] = await db.query<Vehicle[]>("SELECT *, 'vehicle' AS type FROM pending_vehicles");
    const [jobs] = await db.query<Job[]>("SELECT *, 'job' AS type FROM pending_jobs");

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
export async function approvePending(req: Request, res: Response) {
  const { id, type } = req.body;

  try {
    if (type === "vehicle") {
      // Move from pending_vehicles → vehicles
      const [[v]] = await db.query<Vehicle[]>("SELECT * FROM pending_vehicles WHERE id=?", [id]);

      await db.query(
        `INSERT INTO vehicles (ownerId, vin, make, model, plate, year, arrival, departure)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.ownerId, v.vin, v.make, v.model, v.plate, v.year, v.arrival, v.departure]
      );

      await db.query("DELETE FROM pending_vehicles WHERE id=?", [id]);

      await createNotification(
        v.ownerId,
        "A vehicle request has been approved by an administrator."
      );

    }

    if (type === "job") {
      const [[j]] = await db.query<Job[]>("SELECT * FROM pending_jobs WHERE id=?", [id]);

      await db.query(
        `INSERT INTO jobs (clientId, description, duration, deadline, status)
        VALUES (?, ?, ?, ?, 'pending')`,
        [j.clientId, j.description, j.duration, j.deadline]
      );

      await db.query("DELETE FROM pending_jobs WHERE id=?", [id]);

      await createNotification(
        j.clientId,
        "A job request has been approved by an administrator."
      );

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
export async function rejectPending(req: Request, res: Response) {
  const { id, type} = req.body;

  try {
    if (type === "vehicle") {
      const [[v]] = await db.query<Vehicle[]>("SELECT * FROM pending_vehicles WHERE id=?", [id]);
      await db.query("DELETE FROM pending_vehicles WHERE id=?", [id]);

      await createNotification(
        v.ownerId,
        "A vehicle request has been rejected by an administrator."
      );

    }

    if (type === "job") {
      const [[j]] = await db.query<Job[]>("SELECT clientId FROM pending_jobs WHERE id=?", [id]);
      await db.query("DELETE FROM pending_jobs WHERE id=?", [id]);
     
      await createNotification(
        j.clientId,
        "Your job request was rejected by an administrator."
      );
    }

    // Invalidate admin cache
    adminCache.users = null;

    res.json({ message: "Rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting request" });
  }
}
