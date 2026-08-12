import { db } from "../config/db";
import { Request, Response } from "express"
//------------------------------------------------------------------------------
//Implementation of home page functions for client and owners

//get all vehicles for an owner
export async function getOwnerVehicles(req: Request, res: Response) {
  const { userId } = req.params;
  const [rows] = await db.query(
    "SELECT * FROM vehicles WHERE ownerId = ?",
    [userId]
  );
  res.json(rows);
}
//------------------------------------------

//get all jobs for a client
export async function getClientJobs(req: Request, res: Response) {
  const { userId } = req.params;
  const [rows] = await db.query(
    "SELECT * FROM jobs WHERE clientId = ?",
    [userId]
  );
  res.json(rows);
}
//-----------------------------------------

//get notifications for client or owner
export async function getNotifications(req: Request, res: Response) {
  const { userId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE userId = ?",
    [userId]
  );

  // After sending notifications, clear them
  await db.query("DELETE FROM notifications WHERE userId = ?", [userId]);

  res.json(rows);
}
