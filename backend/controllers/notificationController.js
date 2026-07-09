import { db } from "../config/db.js";

export async function getNotifications(req, res) {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT id, message, timestamp FROM notifications WHERE userId = ? ORDER BY timestamp DESC",
      [userId]
    );

    res.json(rows.map(formatJob));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading notifications" });
  }
}

export async function clearNotifications(req, res) {
  try {
    const { userId } = req.params;

    await db.query("DELETE FROM notifications WHERE userId = ?", [userId]);

    res.json({ message: "Notifications cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error clearing notifications" });
  }
}
