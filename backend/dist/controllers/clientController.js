"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientJobs = getClientJobs;
const db_1 = require("../config/db");
const Job_1 = require("../models/Job");
//------------------------------------------------------------------------------
//API implementation of client functions
//SEEMS TO BE REDUNDANT. TO BE REMOVED PENDING REVIEW
//retrieve all jobs belonging to the current client logged in
async function getClientJobs(req, res) {
    try {
        const { clientId } = req.params;
        const [rows] = await db_1.db.query("SELECT * FROM jobs WHERE clientId = ? ORDER BY timestamp DESC", [clientId]);
        const jobs = rows.map(Job_1.formatJob);
        res.json(jobs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error loading client jobs" });
    }
}
