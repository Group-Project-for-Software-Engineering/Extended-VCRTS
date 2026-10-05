"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerVehicles = getOwnerVehicles;
exports.getClientJobs = getClientJobs;
exports.getNotifications = getNotifications;
const db_1 = require("../config/db");
//------------------------------------------------------------------------------
//Implementation of home page functions for client and owners
//get all vehicles for an owner
async function getOwnerVehicles(req, res) {
    const { userId } = req.params;
    const [rows] = await db_1.db.query("SELECT * FROM vehicles WHERE ownerId = ?", [userId]);
    res.json(rows);
}
//------------------------------------------
//get all jobs for a client
async function getClientJobs(req, res) {
    const { userId } = req.params;
    const [rows] = await db_1.db.query("SELECT * FROM jobs WHERE clientId = ?", [userId]);
    res.json(rows);
}
//-----------------------------------------
//get notifications for client or owner
async function getNotifications(req, res) {
    const { userId } = req.params;
    const [rows] = await db_1.db.query("SELECT * FROM notifications WHERE userId = ?", [userId]);
    // After sending notifications, clear them
    await db_1.db.query("DELETE FROM notifications WHERE userId = ?", [userId]);
    res.json(rows);
}
