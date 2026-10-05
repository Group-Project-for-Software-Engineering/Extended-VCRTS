"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRemovableItems = getAllRemovableItems;
exports.removeItem = removeItem;
const db_1 = require("../config/db");
const adminCache_1 = require("../cache/adminCache");
const notificationController_1 = require("./notificationController");
//------------------------------------------------------------------------------
//API implementation of fuctions for admin removal page
//get all current jobs and vehicles that have been approved and are in the system
async function getAllRemovableItems(req, res) {
    try {
        const [vehicles] = await db_1.db.query(`
      SELECT id, ownerId AS userId, vin, make, model, plate, year, arrival, departure,
      'vehicle' AS type
      FROM vehicles
    `);
        const [jobs] = await db_1.db.query(`
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error loading removal items" });
    }
}
//------------------------------------------------------------
//Remove a job or vehicle from the system
async function removeItem(req, res) {
    const { id, type, userId } = req.body;
    try {
        if (type === "vehicle") {
            const [[v]] = await db_1.db.query("SELECT ownerId FROM vehicles WHERE id = ?", [id]);
            await db_1.db.query("DELETE FROM vehicles WHERE id=?", [id]);
            await (0, notificationController_1.createNotification)(v.ownerId, "A vehicle has been removed by an administrator.");
        }
        if (type === "job") {
            const [[j]] = await db_1.db.query("SELECT clientId FROM jobs WHERE id = ?", [id]);
            await db_1.db.query("DELETE FROM jobs WHERE id=?", [id]);
            await (0, notificationController_1.createNotification)(j.clientId, "A job has been removed by an administrator.");
        }
        // Invalidate admin cache
        adminCache_1.adminCache.users = null;
        res.json({ message: "Item removed" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error removing item" });
    }
}
