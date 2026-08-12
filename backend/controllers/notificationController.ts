import { db } from "../config/db";
import { Request, Response } from "express"
//------------------------------------------------------------------------------
//Implementation of functions for notification page

//get notifications for user
export async function getNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT id, message, timestamp FROM notifications WHERE userId = ? ORDER BY timestamp DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading notifications" });
  }
}
//-------------------------------------------------------------

//Make a notification to send back to a user after an accept, reject, or remove by the admin
export async function createNotification(userId: number, message: String) {
  await db.query(
    "INSERT INTO notifications (userId, message) VALUES (?, ?)",
    [userId, message]
  );
}
//-------------------------------------------------------------

//clear notifiations for user
export async function clearNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    await db.query("DELETE FROM notifications WHERE userId = ?", [userId]);

    res.json({ message: "Notifications cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing notifications" });
  }
}
