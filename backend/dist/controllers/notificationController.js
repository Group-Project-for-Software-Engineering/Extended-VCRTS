"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = getNotifications;
exports.createNotification = createNotification;
exports.clearNotifications = clearNotifications;
const db_1 = require("../config/db");
//------------------------------------------------------------------------------
//Implementation of functions for notification page
//get notifications for user
async function getNotifications(req, res) {
    try {
        const { userId } = req.params;
        const [rows] = await db_1.db.query("SELECT id, message, timestamp FROM notifications WHERE userId = ? ORDER BY timestamp DESC", [userId]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error loading notifications" });
    }
}
//-------------------------------------------------------------
//Make a notification to send back to a user after an accept, reject, or remove by the admin
async function createNotification(userId, message) {
    await db_1.db.query("INSERT INTO notifications (userId, message) VALUES (?, ?)", [userId, message]);
}
//-------------------------------------------------------------
//clear notifiations for user
async function clearNotifications(req, res) {
    try {
        const { userId } = req.params;
        await db_1.db.query("DELETE FROM notifications WHERE userId = ?", [userId]);
        res.json({ message: "Notifications cleared" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error clearing notifications" });
    }
}
