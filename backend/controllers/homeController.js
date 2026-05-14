import { db } from "../config/db.js";

export async function getOwnerVehicles(req, res) {
  const { userId } = req.params;
  const [rows] = await db.query(
    "SELECT * FROM vehicles WHERE ownerId = ?",
    [userId]
  );
  res.json(rows);
}

export async function getClientJobs(req, res) {
  const { userId } = req.params;
  const [rows] = await db.query(
    "SELECT * FROM jobs WHERE clientId = ?",
    [userId]
  );
  res.json(rows);
}

export async function getNotifications(req, res) {
  const { userId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE userId = ?",
    [userId]
  );

  // After sending notifications, clear them
  await db.query("DELETE FROM notifications WHERE userId = ?", [userId]);

  res.json(rows);
}
