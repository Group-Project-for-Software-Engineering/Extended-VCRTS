import { db } from "../config/db.js";
import { adminCache } from "../cache/adminCache.js";

export async function getAllUsers(req, res) {
  try {
    // 1. Return cached data if available
    if (adminCache.users) {
      return res.json(adminCache.users);
    }

    // 2. Otherwise query DB
    const [users] = await db.query("SELECT * FROM users");

    for (let user of users) {
      if (user.userType === "Owner") {
        const [vehicles] = await db.query(
          "SELECT * FROM vehicles WHERE ownerId = ?",
          [user.id]
        );
        user.vehicles = vehicles;
      } else if (user.userType === "Client") {
        const [jobs] = await db.query(
          "SELECT * FROM jobs WHERE clientId = ?",
          [user.id]
        );
        user.jobs = jobs;
      }
    }

    // 3. Save to cache
    adminCache.users = users;
    adminCache.lastUpdated = Date.now();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading users" });
  }
}

export async function computeCompletionTimes(req, res) {
  try {
    const [jobs] = await db.query(
      "SELECT id, duration FROM jobs ORDER BY timestamp ASC"
    );

    let currentTime = 0;
    const results = [];

    for (let job of jobs) {
      currentTime += job.duration;
      results.push({
        jobId: job.id,
        completionTime: `${currentTime} hours`
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error computing completion times" });
  }
}
