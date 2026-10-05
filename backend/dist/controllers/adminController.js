"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.computeCompletionTimes = computeCompletionTimes;
const db_1 = require("../config/db");
const adminCache_1 = require("../cache/adminCache");
//------------------------------------------------------------------------------
//Api function implementation for admin home page
//Get all users in the system
async function getAllUsers(req, res) {
    //check cache first before querying database
    try {
        // 1. Return cached data if available
        if (adminCache_1.adminCache.users) {
            return res.json(adminCache_1.adminCache.users);
        }
        // 2. Otherwise query DB
        const [users] = await db_1.db.query("SELECT * FROM users");
        for (let user of users) {
            //if user is owner type
            if (user.userType === "Owner") {
                const [vehicles] = await db_1.db.query("SELECT * FROM vehicles WHERE ownerId = ?", [user.id]);
                user.vehicles = vehicles;
            }
            else if (user.userType === "Client") { //if user is client type
                const [jobs] = await db_1.db.query("SELECT * FROM jobs WHERE clientId = ?", [user.id]);
                user.jobs = jobs;
            }
        }
        // 3. Save to cache
        adminCache_1.adminCache.users = users;
        adminCache_1.adminCache.lastUpdated = Date.now();
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error loading users" });
    }
}
//-------------------------------------------------------------
//Api call implementation of admin home page completion time button
//Current implementation of completion time uses FIFO algorithm
async function computeCompletionTimes(req, res) {
    try {
        const [jobs] = await db_1.db.query("SELECT id, duration FROM jobs ORDER BY timestamp ASC");
        let currentTime = 0;
        const results = [];
        //Fifo algorithm
        for (let job of jobs) {
            currentTime += parseFloat(job.duration.toString().trim());
            results.push({
                jobId: job.id,
                completionTime: `${currentTime} hours`
            });
        }
        res.json(results);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error computing completion times" });
    }
}
